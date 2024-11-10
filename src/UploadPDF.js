import React, { useState } from 'react';
import axios from 'axios';

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // 'file' here should match the backend multer field name

    try {
      setUploading(true);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
      setUploading(false);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload the file');
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default UploadPDF;
