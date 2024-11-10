import React, { useState, useEffect } from "react";
import axios from "axios";

const FileDetails = () => {
  const fileId = "672baa30433b1aa1b396000b"; // Manually set the file ID here
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null); // URL for PDF preview
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchFileDetailsAndPreview = async () => {
      try {
        // Fetch file details and PDF preview together
        const response = await axios.get(`http://localhost:5000/preview/${fileId}`, {
          responseType: "json",
        });

        // Set file details
        setFile(response.data.file);

        // Convert Base64 PDF preview to Blob URL if available
        if (response.data.pdfPreview) {
          const pdfBlob = new Blob([Uint8Array.from(atob(response.data.pdfPreview), c => c.charCodeAt(0))], {
            type: "application/pdf",
          });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        }
      } catch (err) {
        setError("Error fetching file details or generating preview");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetailsAndPreview();
  }, [fileId]);

  // Clean up Blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="file-details">
      <h2>{file.name}</h2>
      <p><strong>Category:</strong> {file.category}</p>
      <p><strong>Description:</strong> {file.description}</p>
      <p><strong>Average Rating:</strong> {file.averageRating} / 5</p>

      {/* Display PDF Preview if available */}
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="600"
          height="400"
          title="PDF Preview"
          frameBorder="0"
        ></iframe>
      ) : (
        <div>No preview available</div>
      )}
    </div>
  );
};

export default FileDetails;
