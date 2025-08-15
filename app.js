const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static('public'));

// Notes file path
const NOTES_FILE = 'notes.json';

// Load notes from file
async function loadNotes() {
    try {
        const data = await fs.readFile(NOTES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save notes to file
async function saveNotes(notes) {
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// GET all notes
app.get('/api/notes', async (req, res) => {
    const notes = await loadNotes();
    res.json(notes);
});

// POST new note
app.post('/api/notes', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const notes = await loadNotes();
    if (notes.find(n => n.title === title)) {
        return res.status(400).json({ error: 'Note already exists' });
    }

    const newNote = {
        id: Date.now(), // unique ID
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    await saveNotes(notes);
    res.status(201).json(newNote);
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const notes = await loadNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.title = title;
    note.updatedAt = new Date().toISOString();
    await saveNotes(notes);
    res.json(note);
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let notes = await loadNotes();
    const noteExists = notes.some(n => n.id === id);
    if (!noteExists) return res.status(404).json({ error: 'Note not found' });

    notes = notes.filter(n => n.id !== id);
    await saveNotes(notes);
    res.json({ message: `Note ${id} deleted` });
});

// Start server
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
