import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from './Navbar';
import { addFileToDB, getFileFromDB } from './db';

const FileDetails = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOffline, setIsOffline] = useState(false);
    const [collections, setCollections] = useState([]);
    const [collectionId, setCollectionId] = useState("");
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState("");
    const [userComment, setUserComment] = useState("");
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/preview/${id}`, {
                    withCredentials: true,
                });
                setFile(response.data.file);
                console.log("Ratings data:", response.data.file.ratings);
                setRatings(response.data.file.ratings || []);
            } catch (err) {
                setError("Could not fetch file details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [id]);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get("http://localhost:5000/folders", {
                    withCredentials: true,
                });
                setCollections(response.data.folders || []);
            } catch (err) {
                console.error("Error fetching collections:", err);
            }
        };

        fetchCollections();
    }, []);

    const handleSaveOffline = async () => {
        try {
            const existingFile = await getFileFromDB(file._id);
            if (!existingFile) {
                await addFileToDB({ id: file._id, ...file });
                setIsOffline(true);
            }
        } catch (error) {
            console.error("Error saving file offline:", error);
        }
    };

    const handleAddFileToCollection = async () => {
        if (!collectionId) {
            alert('Please select a collection');
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/folders/${collectionId}/add-file`,
                { fileId: file._id },
                { withCredentials: true }
            );
            alert('File added to collection successfully!');
            setCollectionId("");
        } catch (err) {
            console.error("Error adding file to collection:", err);
            alert('Failed to add file to collection. Please try again.');
        }
    };

    const handleSubmitRating = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/rate-file",
                { fileId: file._id, rating: userRating, comment: userComment },
                { withCredentials: true }
            );
            setRatings([...ratings, { rating: userRating, comment: userComment }]);
            setUserRating("");
            setUserComment("");
            alert(response.data.message);
        } catch (err) {
            console.error("Error submitting rating:", err);
            alert('Failed to submit rating. Please try again.');
        }
    };

    if (loading) return <div>Loading file details...</div>;
    if (error) return <div>{error}</div>;
    if (!file) return <div>No file found.</div>;

    return (
        <>
            <Navbar />
            <div className="file-details-container">
                <h2>File Details</h2>
                <div className="file-info">
                    <div className="info-item">
                        <strong>Original Name:</strong>
                        <span>{file.name || "N/A"}</span>
                    </div>
                    <div className="info-item">
                        <strong>URL:</strong>
                        <span>{file.url || "N/A"}</span>
                    </div>
                    <div className="info-item">
                        <strong>Created At:</strong>
                        <span>{file.createdAt ? new Date(file.createdAt).toLocaleString() : "N/A"}</span>
                    </div>
                </div>

                <button 
                    onClick={handleSaveOffline} 
                    disabled={isOffline}
                >
                    {isOffline ? "✓ Saved Offline" : "Save Offline"}
                </button>

                <div className="pdf-preview-container">
                    <h3>Preview PDF</h3>
                    <iframe 
                        src={file.url} 
                        width="40%" 
                        height="400px" 
                        title="PDF Preview"
                        frameBorder="0"
                    />
                </div>

                <div>
                    <label>Select a collection to add this file:</label>
                    <select
                        value={collectionId}
                        onChange={(e) => setCollectionId(e.target.value)}
                    >
                        <option value="">Select Collection</option>
                        {collections.map((collection) => (
                            <option key={collection._id} value={collection._id}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddFileToCollection}>Add to Collection</button>
                </div>

                {/* Rating and Comment Section */}
                <div className="rating-section">
                    <h3>Rate this File</h3>
                    <input 
                        type="number" 
                        value={userRating} 
                        onChange={(e) => setUserRating(e.target.value)} 
                        placeholder="Rate from 1 to 5" 
                    />
                    <textarea 
                        value={userComment} 
                        onChange={(e) => setUserComment(e.target.value)} 
                        placeholder="Leave a comment" 
                    ></textarea>
                    <button onClick={handleSubmitRating}>Submit Rating</button>
                </div>

                {/* Display Ratings and Comments */}
                <div className="ratings-display">
                    <h3>Ratings and Comments</h3>
                    {ratings.length ? (
                        ratings.map((rating, index) => (
                            <div key={index} className="rating-item">
                                <strong>Rating:</strong> {rating.rating} <br/>
                                <strong>Comment:</strong> {rating.comment}
                                <strong>Rated by:</strong> {rating.username}
                            </div>
                        ))
                    ) : (
                        <p>No ratings yet.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default FileDetails;
