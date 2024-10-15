// src/components/FileList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/files');
                setFiles(response.data);
            } catch (err) {
                console.error('Error fetching files:', err);
                setError('Failed to load files.');
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h1>Files</h1>
            {error && <p>{error}</p>}
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        <strong>File Name:</strong> {file.originalName} <br />
                        <strong>File ID:</strong> {file.id}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
