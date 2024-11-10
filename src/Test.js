import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');
      
      // Send POST request to upload the file
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFileUrl(response.data.url); // Set the uploaded file URL
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('File upload failed.');
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
      {uploadedFileUrl && (
        <div>
          <p>Uploaded File URL:</p>
          <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
            {uploadedFileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
