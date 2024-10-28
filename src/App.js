import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider
import Home from './Home';
import OfflineFilesList from './OfflineFilesList';
import LoginForm from './component/Login';
import SignupForm from './component/Signup';
import Dashboard from './Dashboard';
import UploadFiles from './UploadFiles';
//import Navbar from './Navbar'; // Import the Navbar component
import Chat from './Chat'; // Import the Chat component
import FileDetails from './FileDetails'; // Import the FileDetails component
import FileList from './FileList';

import FolderComponent from './Folder'
import Chatbot from './Chatbot';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
         {/* Add Navbar to display on all pages */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Redirect to Home on root */}
          <Route path="/files/:id" element={<FileDetails />} />
          <Route path='chatbot' element={<Chatbot/>}/>
         
          <Route path="/folder" element={<FolderComponent />} />
          <Route path="/Chatbot" element={<Chatbot />} />
          <Route path="/offline" element={<OfflineFilesList />} />
          
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadFiles />} /> {/* Add Upload Files route */}
          <Route path="/chat" element={<Chat />} /> {/* Chat route */}
          <Route path="/file-list" element={<FileList />} /> {/* FileList route */}
          {/* Add more routes as necessary */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
