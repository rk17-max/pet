import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import your CSS file for styling
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        setFiles(response.data);
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
      const res = await axios.get("http://localhost:5000/logout", { withCredentials: true }); // Ensure cookies are sent
      if (res.data.status) {
        navigate("/login"); // Redirect to the login page if logout is successful
      } else {
        console.error("Logout failed:", res.data.message); // Log if logout failed
      }
    } catch (err) {
      console.error("Error during logout:", err); // Log any errors that occur during the logout request
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        // Send delete request to the backend with credentials
        await axios.get(`http://localhost:5000/filesdelete/${fileId}`, {
          withCredentials: true // This ensures cookies (e.g., JWT token) are sent
        });

        // Remove the deleted file from the state
        setFiles(files.filter((file) => file._id !== fileId)); // Use `_id` instead of `id`
        console.log(`File ${fileId} deleted successfully`);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
  }

  if (loading) {
    return <div>Loading files...</div>;
  }

  return (
    <div>
      <Navbar/>
      <h1>Home Page</h1>


      {/* Display all uploaded files in a styled square div */}
      <div className="files-container">
        <h2>All Available Notes:</h2>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div key={file.id} className="file-item"> {/* Square div for each file */}
                <Link to={`/files/${file.id}`}>
                  {file.originalName}
                </Link>
                <p>Description: {file.category}</p>
                {/* Delete button */}
                <button onClick={() => handleDelete(file.id)} className="delete-button">
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
