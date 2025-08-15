// 1. Import the 'fs' module (File System)
const fs = require('fs');

// 2. Function to load existing notes
function loadNotes() {
    try {
        const dataBuffer = fs.readFileSync('notes.json'); 
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

// 3. Function to save notes
function saveNotes(notes) {
    const dataJSON = JSON.stringify(notes, null, 2); // null,2 makes JSON pretty
    fs.writeFileSync('notes.json', dataJSON);
}

// 4. Function to add a new note (with duplicate check)
function addNote(title, body) {
    const notes = loadNotes();

    // Check if note with same title exists
    const duplicateNote = notes.find((note) => note.title === title);

    if (!duplicateNote) {
        // If no duplicate, add it
        notes.push({ title, body });
        saveNotes(notes);
        console.log(`✅ Note "${title}" added successfully!`);
    } else {
        console.log(`⚠️ A note with the title "${title}" already exists.`);
    }
}

// 5. Test adding notes
addNote('Shopping List', 'Eggs, Milk, Bread');
addNote('Reminder', 'Meeting at 10 AM');
addNote('Shopping List', 'This should NOT be added'); // Duplicate test
