import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null);
  //const [selectedFolder, setSelectedFolder] = useState('');
  //const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch folders from the API
  const fetchFolders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/folders'); // Update with your API endpoint
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    fetchFolders(); // Fetch folders on component mount
  }, []);

  const handleCreateFolder = async () => {
    if (folderName.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:5000/folders', { name: folderName });
      setFolders((prevFolders) => [...prevFolders, response.data]);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // const handleFileSelect = (event) => {
  //   const newFiles = Array.from(event.target.files);
  //   setSelectedFiles(newFiles);
  // };

  // const handleUploadFiles = async () => {
  //   if (!currentFolder || selectedFiles.length === 0) return;

  //   const formData = new FormData();
  //   selectedFiles.forEach(file => {
  //     formData.append('file', file); // Key must match the multer field name
  //   });

  //   try {
  //     const response = await axios.post(`http://localhost:5000/folders/${currentFolder._id}/files`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     // Update the folders state with the new file reference
  //     setFolders((prevFolders) =>
  //       prevFolders.map((folder) =>
  //         folder._id === currentFolder._id
  //           ? { ...folder, files: [...folder.files, ...response.data] } // Assuming the response returns the updated files
  //           : folder
  //       )
  //     );
  //     setSelectedFiles([]);
  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //   }
  // };

  const handleOpenFolder = (folder) => {
    setCurrentFolder(folder);
  };

  const handleGoBack = () => {
    setCurrentFolder(null);
  };

  return (
    <div style={styles.container}>
      <h2>Your Collections</h2>
      {/* Folder creation section */}
      {!currentFolder && (
        <div style={styles.createFolderSection}>
          <input
            type="text"
            placeholder="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleCreateFolder} style={styles.button}>
            Create Folder
          </button>
        </div>
      )}
      {/* File upload section (only visible if no folder is opened) */}
      {/* {!currentFolder && (
        <div style={styles.uploadSection}>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            style={styles.selectFolder}
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={styles.fileInput}
          />
          <button onClick={handleUploadFiles} style={styles.button}>
            Upload Files
          </button>
        </div> */}
      
      {/* Folder view or file view inside a folder */}
      {currentFolder ? (
        <div style={styles.folderView}>
          <h3>{currentFolder.name}</h3>
          <button onClick={handleGoBack} style={styles.button}>
            Back to Folders
          </button>
          <div style={styles.fileGrid}>
            {currentFolder.files.length > 0 ? (
              currentFolder.files.map((file, fileIndex) => (
                <div key={fileIndex} style={styles.fileItem} onDoubleClick={() => console.log('File Details:', file)}>
                  <img
                    src={file.thumbnailUrl || "https://cdn-icons-png.flaticon.com/512/1509/1509328.png"}
                    alt="file-icon"
                    style={styles.fileIcon}
                  />
                  <p>{file.originalName}</p>
                </div>
              ))
            ) : (
              <p>No files in this folder.</p>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.folderGrid}>
          {folders.map((folder) => (
            <div
              key={folder._id}
              style={styles.folder}
              onDoubleClick={() => handleOpenFolder(folder)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/715/715676.png"
                alt="folder-icon"
                style={styles.folderIcon}
              />
              <p>{folder.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const styles = {
    container: {
      border: '2px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      margin: '0 auto',
      textAlign: 'center',
    },
    createFolderSection: {
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    uploadSection: {
      marginBottom: '20px',
    },
    fileInput: {
      margin: '10px 0',
    },
    selectFolder: {
      marginLeft: '10px',
      padding: '10px',
      fontSize: '16px',
    },
    folderGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
    },
    folder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    },
    folderIcon: {
      width: '80px',
      height: '80px',
    },
    fileGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
    },
    fileItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100px',
      height: '120px',
    },
    fileIcon: {
      width: '50px',
      height: '50px',
    },
  };
  
// Add your existing styles here

export default FolderManager;
