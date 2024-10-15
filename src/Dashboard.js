import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigate
import UploadForm from "./UploadForm"; // Import your upload form component
import { Link } from "react-router-dom"; // Import Link
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import for animations
import "./Dashboard.css"; // Import your CSS styles
import Navbar from './Navbar';

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
    const navigate = useNavigate(); // Initialize navigate

    // Allow cookies with axios requests
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/verify"); // Ensure the correct URL
                if (res.data.status) {
                    // If user is authenticated, set the username from the response
                    setUsername(res.data.username);
                } else {
                    // If user is not authenticated, redirect to home page
                    navigate("/home");
                }
            } catch (err) {
                console.log(err);
                navigate("/home"); // Redirect to home on error as well
            }
        };

        const fetchUploadedFiles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/user/files"); // Fetch uploaded files
                setUploadedFiles(response.data); // Set uploaded files in state
            } catch (error) {
                console.error("Error fetching user files:", error);
            }
        };

        fetchUserData();
        fetchUploadedFiles(); // Fetch uploaded files after fetching user data
    }, [navigate]); // Include navigate in the dependency array

    return (
        <>
        <Navbar/>
        <br></br>
        
        <div className="dashboard">
            
            <h1 className="username">Welcome back, {username}!</h1> {/* Display username */}
            <br></br>
           
            <UploadForm /> {/* Render the upload form */}
            <h2>Your Uploaded Files:</h2>
            <TransitionGroup className="file-list">
                {uploadedFiles.map((file, index) => (
                    <CSSTransition key={index} timeout={500} classNames="fade">
                        <li>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.originalName}
                            </a>
                        </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
        </>
    );
};

export default Dashboard;
