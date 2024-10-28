import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file for styling
import Navbar from './Navbar';
import Chatbot from './Chatbot';
const API_URL = "http://localhost:5000"; // Base API URL

const Home = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/files`);
        setFiles(response.data); // Make sure this matches your API response
        console.log(response.data); // Log the response to check its structure
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/logout`, { withCredentials: true });
      if (res.data.status) {
        navigate("/login");
      } else {
        console.error("Logout failed:", res.data.message);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await axios.delete(`${API_URL}/filesdelete/${fileId}`, {
          withCredentials: true
        });

        // Remove the deleted file from the state
        setFiles(files.filter((file) => file.id !== fileId));
        console.log(`File ${fileId} deleted successfully`);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
  };

  // Filter files based on the search query and ensure only PDFs are shown
  const filteredFiles = files.filter(file => 
    (file.category && file.category.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (file.originalName && file.originalName.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).filter(file => file.url && file.url.endsWith('.pdf')); // Ensure only PDF files are shown

  if (loading) {
    return <div>Loading files...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>

      {/* Search Input */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search by category or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          className="search-input"
        />
       
      </div>

      <div className="files-container">
        <h2>All Available Notes:</h2>
        {filteredFiles.length === 0 ? (
          <p>No files found.</p>
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-item">
                <img 
                  src={`${API_URL}${file.thumbnailUrl}`} 
                  className='thumbnail' 
                  alt={file.originalName} 
                  onError={(e) => { e.target.src = '/path/to/default-thumbnail.jpg'; }} // Fallback image
                />
                <Link to={`/files/${file.id}`}>
                  {file.originalName}
                </Link>
                <br />
                <p className='cd'>Description: {file.description || 'No description available'}</p>
                <p className='cd'>Category: {file.category || 'No category assigned'}</p>
                
                {/* Display Average Rating and Total Ratings */}
                <div className="rating-info">
                  <p className='or'>Average Rating: {file.averageRating || 'N/A'} ⭐</p>
                  <p className='or'>Total Ratings: {file.totalRatings || 0}</p>
                </div>

                <button onClick={() => handleDelete(file.id)} className="delete-button" aria-label={`Delete ${file.originalName}`}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
