import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { addFileToDB } from './db'; 
import Navbar from './Navbar';
import StarRating from './StarRating';

const FileDetails = () => {
    const { id } = useParams(); // Get the file ID from the URL
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [users, setUsers] = useState({});
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [collectionId, setCollectionId] = useState(""); // State to store collection ID
    const [folders, setFolders] = useState([]); // State to store folders

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/files/${id}`, {
                    withCredentials: true
                });
                setFile(response.data);

                const userIds = response.data.ratings.map(rating => rating.user);
                const uniqueUserIds = [...new Set(userIds)];

                const userResponses = await Promise.all(
                    uniqueUserIds.map(userId =>
                        axios.get(`http://localhost:5000/users/${userId}`, {
                            withCredentials: true
                        })
                    )
                );

                const usersMap = {};
                userResponses.forEach(userResponse => {
                    const user = userResponse.data;
                    usersMap[user._id] = user.username;
                });
                setUsers(usersMap);
            } catch (err) {
                console.error("Error fetching file details:", err.response ? err.response.data : err.message);
                setError("Could not fetch file details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        const fetchFolders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/folders`, {
                    withCredentials: true
                });
                setFolders(response.data);
            } catch (err) {
                console.error("Error fetching folders:", err);
                setError("Could not fetch folders. Please try again later.");
            }
        };

        fetchFileDetails();
        fetchFolders();
    }, [id]);

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/rate-file`, {
                fileId: id,
                rating,
                comment,
            }, {
                withCredentials: true
            });

            console.log(response.data);
            setFile(prevFile => ({
                ...prevFile,
                ratings: [...prevFile.ratings, { user: "you", rating, comment }]
            }));
            setRating(0);
            setComment("");
        } catch (err) {
            console.error("Error submitting rating:", err);
            setError("Failed to submit rating. Please try again.");
        }
    };

    const handleAddFileToCollection = async () => {
        if (!collectionId) {
            alert("Please select a collection ID."); // Simple validation
            return;
        }
    
        try {
            // First, add the file to the collection in the backend
            const response = await axios.post(`http://localhost:5000/folders/${collectionId}/add-file`, {
                fileId: file._id // Ensure you're using the correct ID here
            }, {
                withCredentials: true
            });
    
            console.log(response.data);
            alert(response.data.message); // Show success message
    
            // Log the file object to check its properties
            console.log("File object being processed:", file);
    
            // Now, save the file data offline
            const fileData = { id: file._id, ...file }; // Use file._id instead of file.id
            console.log("File data being saved to DB:", fileData); // Check structure
    
            // Ensure 'id' is defined
            if (!fileData.id) {
                throw new Error("File ID is undefined. Cannot save to DB.");
            }
    
            await addFileToDB(fileData);
    
        } catch (err) {
            console.error("Error adding file to collection:", err);
            setError("Failed to add file to collection. Please try again.");
        }
    };
    

    if (loading) {
        return <div>Loading file details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!file) {
        return <div>No file found.</div>;
    }

    return (
        <>
        <Navbar/>
        <div>
            <h2>File Details</h2>
            <p><strong>Original Name:</strong> {file.originalName || "N/A"}</p>
            <p><strong>URL:</strong> {file.url || "N/A"}</p>
            <p><strong>Created At:</strong> {file.createdAt ? new Date(file.createdAt).toLocaleString() : "N/A"}</p>

            {/* PDF Preview */}
            {file.url && (
                <div style={{ margin: '20px 0' }}>
                    <h3>Preview:</h3>
                    <iframe
                        src={`http://localhost:5000/${file.url}`}
                        width="600"
                        height="400"
                        title="PDF Preview"
                        style={{ border: 'none' }}
                    />
                </div>
            )}

            {/* Display ratings with usernames */}
            {file.ratings && file.ratings.length > 0 ? (
               <div>
               <h3>Ratings:</h3>
               <ul>
                 {file.ratings.map((rating, index) => (
                     <li key={index} style={styles.ratingItem}>
                       <strong>User:</strong> {users[rating.user] || "Unknown User"} - 
                       <strong>Rating:</strong> <StarRating rating={rating.rating} /> - 
                       <strong>Comment:</strong> {rating.comment || "No comments"}
                     </li>
                 ))}
               </ul>
             </div>
            ) : (
                <p>No ratings yet.</p>
            )}

            {/* Rating and Comment Form */}
            <form onSubmit={handleRatingSubmit}>
                <h3>Rate this file:</h3>
                <div>
                    <label>
                        Rating:
                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            min="1"
                            max="5"
                            required
                        />
                    </label>
                </div>
                
                <div>
                    <label>
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Submit Rating</button>
            </form>

            {/* Button to Add File to Collection */}
            <div style={{ marginTop: '20px' }}>
                <label>
                    Select Collection:
                    <select
                        value={collectionId}
                        onChange={(e) => setCollectionId(e.target.value)}
                        required
                    >
                        <option value="">Select a collection</option>
                        {folders.map(folder => (
                            <option key={folder._id} value={folder._id}>
                                {folder.name} {/* Assuming folders have a `name` property */}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleAddFileToCollection}>Add File to Collection</button>
            </div>

            <a href={`http://localhost:5000/${file.url}`} download>Download File</a>
        </div>
        </>
    );
};

const styles = {
    ratingItem: {
      marginBottom: '15px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
};

export default FileDetails;
