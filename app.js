const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from "public" folder

const NOTES_FILE = 'notes.json';

async function loadNotes() {
    try {
        const data = await fs.readFile(NOTES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveNotes(notes) {
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// API routes
app.get('/api/notes', async (req, res) => {
    const notes = await loadNotes();
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const notes = await loadNotes();
    const duplicate = notes.find(note => note.title === title);
    if (duplicate) return res.status(400).json({ error: 'Note already exists' });

    const newNote = { id: notes.length + 1, title };
    notes.push(newNote);
    await saveNotes(notes);
    res.status(201).json(newNote);
});

app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let notes = await loadNotes();
    const noteExists = notes.find(note => note.id === id);
    if (!noteExists) return res.status(404).json({ error: 'Note not found' });

    notes = notes.filter(note => note.id !== id);
    await saveNotes(notes);
    res.json({ message: `Note ${id} deleted` });
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
