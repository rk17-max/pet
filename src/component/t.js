
import Lottie from 'react-lottie';
import { Link, useNavigate } from "react-router-dom";
import '../styles/login.css'; // Adjust if your CSS is in a different subdirectory
import img from '../assets/solvebuddy1.png'; // Adjust based on the actual image file name
import logindata from '../assets/loginAnimation'; 
import { useState } from "react";

import axios from "axios";
//import { useUser } from './UserContext'; // Import the UserContext
import { jwtDecode } from 'jwt-decode';
export default function Login() {
    const [email, setEmail] = useState("demo@gmail.com");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    //const { setUsername } = useUser(); // Get setUsername from context
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Send login request
        axios
            .post("http://localhost:5000/login", {
                email,
                password,
            })
            .then((response) => {
                console.log(response.data); // Log the entire response for debugging

                // Check if login was successful
                if (response.data.status) {
                    //const decodedToken = jwtDecode(response.data.Token); // Decode the token
                    //setUsername(decodedToken.username); // Set username in context
                    navigate("/home"); // Redirect to /home on successful login
                } else {
                    setErrorMessage(response.data.message || "Login failed"); // Set error message
                }
            })
            .catch((err) => {
                console.log(err);
                setErrorMessage("An error occurred. Please try again."); // Set error message
            });
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: logindata,
    };

    return (
        <div className="login">
            <div className="sideimg">
                <p><Lottie options={defaultOptions} height={400} width={400} /></p>
            </div>

            <form onSubmit={handleSubmit}>
                <img src={img} alt="logo" className="logo" />
                <h1>😊Welcome to SolveBuddy</h1>
                <input type="email" placeholder="demo@gmail.com" onChange={handleEmailChange} required />
                <input type="password" placeholder="password" onChange={handlePasswordChange} required />
                <button type="submit">Login</button>
                <Link to="/signup">Signup</Link>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            </form>
        </div>
    );
}
