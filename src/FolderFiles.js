import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
//import './FolderFiles.css'; // Create a CSS file for styles

const FolderFiles = () => {
  const { folderId } = useParams(); // Get the folderId from URL params
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/folders/${folderId}/files`);
        setFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]); // Re-fetch if folderId changes

  if (loading) return <div>Loading files...</div>;

  return (
    <div className="files-container">
      <h1>Files in this Folder</h1>
      <div className="files-list">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-item">
              <span>{file.originalName}</span>
            </div>
          ))
        ) : (
          <p>No files found in this folder.</p>
        )}
      </div>
    </div>
  );
};

export default FolderFiles;
