const fs = require('fs');

// Load existing notes
function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        return JSON.parse(dataBuffer.toString());
    } catch (e) {
        return [];
    }
}

// Save notes
function saveNotes(notes) {
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));
}

// Add a note (with duplicate check)
function addNote(title, body) {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title === title);

    if (!duplicateNote) {
        notes.push({ title, body });
        saveNotes(notes);
        console.log(`✅ Note "${title}" added successfully!`);
    } else {
        console.log(`⚠️ A note with the title "${title}" already exists.`);
    }
}

// Get user input from terminal
const command = process.argv[2]; // The action: add, list, etc.
const title = process.argv[3];   // The note title
const body = process.argv[4];    // The note body

// Handle commands
if (command === 'add') {
    if (!title || !body) {
        console.log("⚠️ Please provide both a title and body for the note.");
    } else {
        addNote(title, body);
    }
} else {
    console.log("❓ Unknown command. Use: add <title> <body>");
}
