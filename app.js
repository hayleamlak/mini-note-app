const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve frontend

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/notes-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Note Schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// GET all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new note
app.post('/api/notes', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const note = new Note({ title });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'Note already exists' });
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
