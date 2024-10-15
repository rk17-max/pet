import React, { useEffect, useState } from "react";
import axios from "axios";

const UploadedFilesList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/files");
                setFiles(response.data);
            } catch (err) {
                console.error("Error fetching files:", err);
            }
        };

        fetchFiles();
    }, []);

    const deleteFile = async (filename) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete/${filename}`, {
                withCredentials: true, // Include credentials if necessary
            });
            console.log('Delete response:', response.data);
            alert(response.data.message); // Show success message to the user
            // Remove the deleted file from the state to update the UI
            setFiles((prevFiles) => prevFiles.filter((file) => file !== filename));
        } catch (error) {
            console.error('Error deleting file:', error);
            if (error.response) {
                alert('Error deleting file: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error deleting file: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h2>Uploaded Files:</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={`http://localhost:5000/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                            {file}
                        </a>
                        <button onClick={() => deleteFile(file)} style={{ marginLeft: '10px', color: 'red' }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UploadedFilesList;
