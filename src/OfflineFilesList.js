import React, { useState, useEffect } from 'react';
import { getAllFilesFromDB } from './db'; // Adjust the import path as needed
import './offline.css'
const OfflineFiles = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            const offlineFiles = await getAllFilesFromDB();
            setFiles(offlineFiles);
        };

        fetchFiles();
    }, []);

    const openPreview = (file) => {
        setSelectedFile(file);
    };

    const closePreview = () => {
        setSelectedFile(null);
    };

    return (
        <div>
            <h2>Offline Files</h2>
            {files.map((file) => (
                <div key={file.id}>
                    <h3>Name: {file.name}</h3>
                    <p>Description: {file.description}</p>
                    <button onClick={() => openPreview(file)}>Preview PDF</button>
                </div>
            ))}

            {/* Preview Modal */}
            {selectedFile && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closePreview}>&times;</span>
                        <h2>{selectedFile.name}</h2>
                        <p>{selectedFile.description}</p>
                        <iframe
    src={`http://localhost:5000/${selectedFile.url}`} // Ensure this is correct
    title="PDF Preview"
    width="100%"
    height="500px"
></iframe>

                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineFiles;
