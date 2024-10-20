// Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import your CSS file for styling
import axios from 'axios';
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/logout", { withCredentials: true });
      if (res.data.status) {
        navigate("/login");
      } else {
        console.error("Logout failed:", res.data.message);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Solvebuddy</Link>
        <ul className="navbar-menu">

        <li>
            <Link to="/Home" className="navbar-item">Home</Link>
          </li>
          <li>
            <Link to="/dashboard" className="navbar-item">Dashboard</Link>
          </li>
          <li>
            <Link to="/chat" className="navbar-item">Chat</Link>
          </li>
         
          <li>
            <Link to="/about" className="navbar-item">About</Link>
          </li>
          <button onClick={handleLogout}>
           LogOut
          </button>
          {/* Add more links as needed */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
