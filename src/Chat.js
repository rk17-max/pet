import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext'; // Import the UserContext
import Navbar from './Navbar';
const Chat = () => {
  const { username: contextUsername } = useUser(); // Get username from context
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(contextUsername || localStorage.getItem('username')); // Retrieve username from context or local storage

  useEffect(() => {
    const newSocket = io('http://localhost:8080', { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('previous messages', (previousMessages) => {
      setMessages(previousMessages);
    });

    newSocket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    // Store username in local storage
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]); // Update local storage whenever the username changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && username) {
      socket.emit('chat message', { message, senderId: username });
      setMessage('');
    } else {
      console.log('Message or username is empty');
    }
  };

  return (
    <div>
      <Navbar/>
      <h1>Chat Room</h1>
      <h2>Logged in as: {username}</h2> {/* Displaying the logged-in username */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.senderId}: </strong>{msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
