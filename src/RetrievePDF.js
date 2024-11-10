import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RetrievePDF = ({ fileId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve the PDF file by its ID
    const fetchPDF = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/file/${fileId}`, {
          responseType: 'blob', // Ensure the response is a file (blob)
        });

        // Create a URL for the PDF file
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError('Failed to retrieve the PDF');
      }
    };

    if (fileId) {
      fetchPDF();
    }
  }, [fileId]);

  return (
    <div>
      <h2>Retrieve PDF</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          width="100%"
          height="500px"
        ></iframe>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default RetrievePDF;
