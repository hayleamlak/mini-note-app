const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;

app.use(express.json());

// File path for storing notes
const NOTES_FILE = 'notes.json';

// ===== Helper functions =====

// Load notes from file
async function loadNotes() {
    try {
        const data = await fs.readFile(NOTES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// Save notes to file
async function saveNotes(notes) {
    await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// ===== Middleware =====
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// ===== Routes =====

// Home page
app.get('/', (req, res) => res.send('Welcome to Home Page'));

// Get all notes
app.get('/api/notes', async (req, res) => {
    const notes = await loadNotes();
    res.json(notes);
});

// Add a new note
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

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let notes = await loadNotes();
    const noteExists = notes.find(note => note.id === id);
    if (!noteExists) return res.status(404).json({ error: 'Note not found' });

    notes = notes.filter(note => note.id !== id);
    await saveNotes(notes);
    res.json({ message: `Note ${id} deleted` });
});

// 404 handler
app.use((req, res) => res.status(404).send('Page Not Found'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
