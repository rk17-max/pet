// src/components/AllUploadedFiles.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const AllUploadedFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/files");
                console.log("Fetched files:", response.data); // Debugging line
                setFiles(response.data);
            } catch (err) {
                console.error("Error fetching files:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = async (fileId) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            try {
                // Send delete request to the backend with credentials
                await axios.get(`http://localhost:5000/filesdelete/${fileId}`, {
                    withCredentials: true // This ensures cookies (e.g., JWT token) are sent
                });
    
                // Remove the deleted file from the state
                setFiles(files.filter((file) => file.id !== fileId));
                console.log(`File ${fileId} deleted successfully`);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }
    };

    if (loading) {
        return <div>Loading files...</div>;
    }

    return (
        <div>
            <h2>All Uploaded Files:</h2>
            {files.length === 0 ? (
                <p>No files uploaded yet.</p>
            ) : (
                <ul>
                    {files.map((file) => (
                        <li key={file.id}> {/* Use id instead of _id */}
                            <Link to={`/files/${file.id}`}> {/* Use id instead of _id */}
                                {file.originalName} {/* Display the original name */}
                            </Link>
                            {/* Delete button */}
                            <button onClick={() => handleDelete(file.id)}>Delete</button> {/* Delete button */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AllUploadedFiles;
