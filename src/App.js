import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider
import Home from './Home';
import OfflineFilesList from './OfflineFilesList';
import LoginForm from './component/Login';
import SignupForm from './component/Signup';
import Dashboard from './Dashboard';
import UploadFiles from './UploadFiles';
import GetCookieComponent from './Tokenfetcher';
import LandingPage from './LandingPage';
import Chat from './Chat'; // Import the Chat component
import FileDetails from './FileDetails'; // Import the FileDetails component
import FileDetailss from './Filepreview'
import LoadingAnimation from './Loadingfiles'
import FolderComponent from './Folder'
import Chatbot from './Chatbot';
import FileUpload from './Test';
import UserFolders from './UserFolders';
import FolderFiles from './FolderFiles';
import UserFiles from './Userfiles';
import Profile from './Profile';
import Navbar from './Navbar';

import UploadPDF from './UploadPDF';
import RetrievePDF from './RetrievePDF';
const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
      
         {/* Add Navbar to display on all pages */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Redirect to Home on root */}
          <Route path="/files/:id" element={<FileDetails />} />
          <Route path='chatbot' element={<Chatbot/>}/>
           <Route path='loading' element={<LoadingAnimation/>}/>
           <Route path='files' element={<UserFiles/>}/>
           <Route path='UserFolders' element={<UserFolders/>}/>
           <Route path='Profile' element={<Profile/>}/>
           <Route path="/folders/:folderId/files" element={<FolderFiles />} />
          <Route path="/folder" element={<FolderComponent />} />
          <Route path="/Chatbot" element={<Chatbot />} />
          <Route path="/offline" element={<OfflineFilesList />} />
          <Route path="/token" element={<GetCookieComponent />} />
          <Route path="/preview" element={<FileDetailss />} />
          <Route path="/Landing" element={<LandingPage />} />

          <Route path="/upload" element={<UploadPDF />} />
          <Route path="/retrieve" element={<RetrievePDF />} />
          
          
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadFiles />} /> {/* Add Upload Files route */}
          <Route path="/chat" element={<Chat />} /> {/* Chat route */}
    
          {/* Add more routes as necessary */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
