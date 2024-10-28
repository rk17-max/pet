// db.js
import { openDB } from 'idb';

const dbPromise = openDB('notesDB', 1, {
    upgrade(db) {
        db.createObjectStore('files', { keyPath: 'id' });
    },
});

// Function to add a file to IndexedDB
export const addFileToDB = async (file) => {
    const db = await dbPromise;
    await db.put('files', file);
};

// Function to get a file from IndexedDB by ID
export const getFileFromDB = async (id) => {
    const db = await dbPromise;
    return await db.get('files', id);
};

// Function to get all files from IndexedDB
export const getAllFilesFromDB = async () => {
    const db = await dbPromise;
    return await db.getAll('files');
};

// Function to delete a file from IndexedDB by ID
export const deleteFileFromDB = async (id) => {
    const db = await dbPromise;
    await db.delete('files', id);
};
