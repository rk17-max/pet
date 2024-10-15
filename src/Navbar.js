// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import your CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">My App</Link>
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
          {/* Add more links as needed */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
