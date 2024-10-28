import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import the CSS file for styling

const Chatbot = () => {
  const [questionType, setQuestionType] = useState(''); // State to manage question type
  const [inputValue, setInputValue] = useState(''); // State for input value
  const [placeholderText, setPlaceholderText] = useState('Enter your query'); // State for placeholder text
  const [chatHistory, setChatHistory] = useState([]); // State to keep track of chat messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if questionType is set
    if (!questionType) {
      const errorMessage = 'Please select a question type before submitting.';
      setChatHistory((prevHistory) => [...prevHistory, `Bot: ${errorMessage}`]); // Add error message to chat history
      console.error(errorMessage);
      return;
    }

    const userMessage = `You: ${inputValue}`;
    setChatHistory((prevHistory) => [...prevHistory, userMessage]); // Add user message to chat history

    try {
      const result = await axios.post('http://localhost:5000/chatbot', {
        questionType, // Include question type in the request
        inputValue, // Send the input value to the backend
      });

      const botMessage = `Bot: ${result.data.message}`; // Prepare bot message
      setChatHistory((prevHistory) => [...prevHistory, userMessage, botMessage]); // Append both user and bot messages
    } catch (error) {
      console.error('Error sending question:', error);
      const errorMessage = 'Sorry, something went wrong. Please try again.';
      setChatHistory((prevHistory) => [...prevHistory, userMessage, `Bot: ${errorMessage}`]); // Log error in chat history
    }

    setInputValue(''); // Clear the input after submission
  };

  // Suggested questions to display
  const suggestedQuestions = [
    'Find by Name',
    'Find by Category',
    'Find by Description',
    'General Inquiry'
  ];

  const handleSuggestionClick = (suggestion) => {
    // Convert to a format that can be used in the backend without spaces
    const formattedQuestionType = suggestion.toLowerCase().replace(/\s+/g, '_'); // Replace spaces with underscores
    setQuestionType(formattedQuestionType); // Set the formatted question type
    setInputValue(''); // Clear previous input
  
    // Update the placeholder text based on the selected suggestion
    switch (suggestion) {
      case 'Find by Category':
        setPlaceholderText('Enter the category you want to search:');
        break;
      case 'Find by Name':
        setPlaceholderText('Enter the name of the file you want to find:');
        break;
      case 'Find by Description':
        setPlaceholderText('Enter the description of the file you are looking for:');
        break;
      default:
        setPlaceholderText('What would you like to ask?');
    }
  };
  
  return (
    <div className="chatbot-container">
      <h2>Chatbot</h2>
      <div className="chat-window">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className="chat-message">
              {/* Render the message as HTML to support links */}
              <span dangerouslySetInnerHTML={{ __html: msg }} />
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText} // Use dynamic placeholder text
            required
          />
          <button type="submit">Send</button>
        </form>
        <div className="suggestions">
          <h4>Suggested Questions:</h4>
          {suggestedQuestions.map((suggestion, index) => (
            <button 
              key={index} 
              className="suggestion-button" 
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
