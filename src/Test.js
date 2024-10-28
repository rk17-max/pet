import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Test1.css'; // Create a CSS file for styling

const API_URL = "http://localhost:5000"; // Base API URL

const Test = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/files`);
        setFiles(response.data);
        console.log("Fetched Files:", response.data); // Log the fetched files
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to load files. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return <div className="loader">Loading files...</div>; // Loader style
  }

  if (error) {
    return <div className="error">{error}</div>; // Display error if any
  }

  return (
    <div>
      <h1>Available Files</h1>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul className="file-list">
          {files.map(file => {
            // Check if thumbnailData is an object or a string
            const thumbnailData = typeof file.thumbnailData === 'string' 
              ? file.thumbnailData 
              : file.thumbnailData?.data; // Adjust this based on your actual data structure
            
            // Construct the Base64 URL for the thumbnail image
            const thumbnailUrl = thumbnailData ? `data:image/png;base64,${thumbnailData}` : null;

            return (
              <li key={file._id} className="file-item"> {/* Changed key to file._id */}
                {/* Display the thumbnail image if available */}
                {thumbnailUrl && (
                  <img 
                    src={thumbnailUrl} 
                    alt={file.originalName} 
                    className="thumbnail" 
                    onError={(e) => { 
                      e.target.src = '/path/to/default-thumbnail.jpg'; // Fallback image
                      console.error("Thumbnail failed to load:", thumbnailUrl); // Log if the image fails to load
                    }} 
                  />
                )}
                {/* Use Link component for navigation */}
                <Link to={`/files/${file._id}`} target="_blank" rel="noopener noreferrer"> {/* Change here */}
                  {file.originalName} (view)
                </Link>
                <p>Description: {file.description || 'No description available'}</p>
                <p>Category: {file.category || 'No category assigned'}</p>
                <p>Average Rating: {file.averageRating || 'N/A'} ⭐</p>
                <p>Total Ratings: {file.totalRatings || 0}</p>
                <p>Total data: {file.fileData || 0}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Test; 
