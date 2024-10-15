// UsernameDisplay.js
import React from 'react';
import { useUser } from './UserContext'; // Import the UserContext

const UsernameDisplay = () => {
  const { username } = useUser(); // Get username from context

  return (
    <div>
      {username ? (
        <h2>Welcome, {username}!</h2> // Display the username if it exists
      ) : (
        <h2>Welcome, Guest!</h2> // Default message if no username
      )}
    </div>
  );
};

export default UsernameDisplay;
