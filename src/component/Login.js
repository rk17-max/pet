// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';
// import { useUser } from '../UserContext'; // Import the UserContext
// //import './Loginform.css'; // Import your CSS styles

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState(""); // State for error messages
//   const navigate = useNavigate();
//   const { setUsername } = useUser(); // Get setUsername from context

//   axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     axios
//       .post("http://localhost:5000/login", {
//         email,
//         password,
//       })
//       .then((response) => {
//         console.log(response.data.Token);
//         const decodedToken = jwtDecode(response.data.Token);
//         console.log("Username:", decodedToken.username); // Log the username
//         setUsername(decodedToken.username); // Set username in context
//         localStorage.setItem('username', decodedToken.username)
//         if (response.data.status) {
//           navigate("/home"); // Redirect to /home on successful login
//         } else {
//           setErrorMessage(response.data.message || "Login failed"); // Set error message
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setErrorMessage("An error occurred. Please try again."); // Set error message
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <div>
//         <label htmlFor="email">Email:</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="password">Password:</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Login</button>
//       {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
//     </form>
//   );
// };

// export default LoginForm; // Export the updated LoginForm



import Lottie from 'react-lottie';
import { Link, useNavigate } from "react-router-dom";
import '../style/login.css'; // Adjust if your CSS is in a different subdirectory
import img from '../assets/solvebuddy1.png'; // Adjust based on the actual image file name
import logindata from '../assets/loginanimation'; 
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../UserContext'; // Import the UserContext
export default function Login() {
    const [email, setEmail] = useState("demo@gmail.com");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const navigate = useNavigate();
    const { setUsername } = useUser();

    // Set axios to allow credentials (cookies) to be sent with requests
    axios.defaults.withCredentials = true; 

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
                    const decodedToken = jwtDecode(response.data.Token);
        console.log("Username:", decodedToken.username); // Log the username
        setUsername(decodedToken.username); // Set username in context
        localStorage.setItem('username', decodedToken.username)
                    // You may want to set the username in context here
                    // setUsername(decodedToken.username); // Uncomment if you have a UserContext
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
                <input type="email" placeholder="demo@gmail.com" value={email} onChange={handleEmailChange} required />
                <input type="password" placeholder="password" value={password} onChange={handlePasswordChange} required />
                <button type="submit">Login</button>
                <Link to="/signup">Signup</Link>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            </form>
        </div>
    );
}
