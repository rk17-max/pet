import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FileDetails = () => {
    const { id } = useParams(); // Get the file ID from the URL
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [users, setUsers] = useState({}); // State to store user data
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchFileDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/files/${id}`, {
                    withCredentials: true // Ensure credentials are sent
                });
                setFile(response.data);

                // Fetch user details for ratings
                const userIds = response.data.ratings.map(rating => rating.user);
                const uniqueUserIds = [...new Set(userIds)]; // Get unique user IDs

                // Fetch user details in bulk
                const userResponses = await Promise.all(
                    uniqueUserIds.map(userId =>
                        axios.get(`http://localhost:5000/users/${userId}`, {
                            withCredentials: true // Ensure credentials are sent
                        })
                    )
                );

                // Map user IDs to usernames
                const usersMap = {};
                userResponses.forEach(userResponse => {
                    const user = userResponse.data;
                    usersMap[user._id] = user.username; // Assuming the user object has _id and username
                });
                setUsers(usersMap);
            } catch (err) {
                console.error("Error fetching file details:", err.response ? err.response.data : err.message);
                setError("Could not fetch file details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [id]);

    const handleRatingSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            const response = await axios.post(`http://localhost:5000/rate-file`, {
                fileId: id,
                rating,
                comment,
            }, {
                withCredentials: true // Ensure credentials are sent
            });

            console.log(response.data);
            // Optionally, you could update the file state to include the new rating without fetching again
            setFile(prevFile => ({
                ...prevFile,
                ratings: [...prevFile.ratings, { user: "you", rating, comment }] // Adjust "you" as needed
            }));
            setRating(0); // Reset rating
            setComment(""); // Reset comment
        } catch (err) {
            console.error("Error submitting rating:", err);
            setError("Failed to submit rating. Please try again.");
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
                            <li key={index}>
                                <strong>User:</strong> {users[rating.user] || "Unknown User"} - <strong>Rating:</strong> {rating.rating} - <strong>Comment:</strong> {rating.comment || "No comments"}
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

            <a href={`http://localhost:5000/${file.url}`} download>Download File</a>
        </div>
    );
};

export default FileDetails;