import React, { useState, useEffect } from 'react';
import { Folder, FileText, Calendar, User, Tag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UserFolderss.css';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const UserFolders = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/folders");
        // Access the folders array from the response data
        console.log("Fetched folders:", response.data.folders);
        setFolders(response.data.folders || []); // Ensure we always have an array
      } catch (error) {
        console.error("Error fetching folders:", error);
        setFolders([]); // Set empty array on error
      }
    };
    fetchFolders();
  }, []);

  const handleFolderClick = (folder) => {
    console.log("Clicked folder:", folder);
    if (folder) {
      setSelectedFolder(folder);
    } else {
      console.warn("Folder data is undefined");
    }
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  const handleShare = (link) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this file!',
        text: 'Here is a file I thought you d find interesting!',
        url: link,
      }).catch(error => console.error('Error sharing:', error));
    } else {
      // Generate sharing links for specific platforms
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}`;
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
  
      alert(`Copy and paste the link to share:\n\n${link}\n\nOr use these platform links:\n
        WhatsApp: ${whatsappUrl}\n
        Telegram: ${telegramUrl}\n
        Twitter: ${twitterUrl}\n
        Facebook: ${facebookUrl}`
      );
    }
  };
  
  // Guard against folders being undefined
  if (!Array.isArray(folders)) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="folders-container">
        <h1 className="folder-title">
          {selectedFolder ? `${selectedFolder.name} Files` : "Your Collection"}
        </h1>

        {selectedFolder ? (
          <div className="selected-folder-content">
            <button onClick={handleBackToFolders} className="back-button">
              <span className="button-icon">←</span>
              Back to Folders
            </button>
            
            <div className="files-grid">
              {selectedFolder.files && selectedFolder.files.map((file, index) => {
                const baseLink = `${window.location.origin}/files/${file._id}`;

                return (
                  <div key={file._id || index} className="file-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="file-icon-wrapper">
                      <FileText className="file-main-icon" />
                    </div>

                    <div className="file-content">
                      <h2 className="file-title">{file.name}</h2>

                      <div className="file-details">
                        <div className="detail-item">
                          <Tag className="detail-icon" />
                          <span>{file.category || 'Uncategorized'}</span>
                        </div>

                        <div className="detail-item">
                          <Info className="detail-icon" />
                          <span>{file.description || 'No description'}</span>
                        </div>

                        <div className="detail-item">
                          <User className="detail-icon" />
                          <span>{file.user || 'Unknown user'}</span>
                        </div>

                        <div className="detail-item">
                          <Calendar className="detail-icon" />
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="file-actions">
                        <button className="action-button view">View</button>
                        <button className="action-button download">Download</button>
                        <button className="action-button share" onClick={() => handleShare(baseLink)}>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="folders-grid">
            {folders.map((folder, index) => (
              <div 
                key={folder._id || index}
                className="folder-item"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div 
                  className="folder-card"
                  onClick={() => handleFolderClick(folder)}
                >
                  <Folder className="folder-icon" />
                  <span className="folder-name">{folder.name}</span>
                  {folder.files && folder.files.length > 0 && (
                    <div className="file-count">
                      {folder.files.length}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default UserFolders;