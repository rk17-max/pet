import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSend = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    // Add user message to the messages array
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send user input to backend API
      const response = await axios.post('http://localhost:5000/chatbot', { inputValue: inputMessage });
      const botResponse = {
        text: response.data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      // Add bot response to the messages array
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      const errorMessage = {
        text: "Sorry, there was an error getting the response.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInputMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Website Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-75">{message.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
