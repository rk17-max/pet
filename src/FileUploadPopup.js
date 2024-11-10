// FileUploadPopup.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './FileUploadPopup.css';

const FileUploadPopup = ({ isOpen, onClose, onSuccess }) => {
  const [files, setFiles] = useState({ pdf: null, thumbnail: null });
  const [fileNames, setFileNames] = useState({ pdf: '', thumbnail: '' });
  const [metadata, setMetadata] = useState({ name: '', category: '', description: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const fileInputRefs = { pdf: useRef(), thumbnail: useRef() };
  const formRef = useRef(null);

  const createPetal = () => {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
    petal.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    document.body.appendChild(petal);

    petal.addEventListener('animationend', () => {
      petal.remove();
    });
  };

  const celebrate = () => {
    setShowCelebration(true);
    for (let i = 0; i < 50; i++) {
      setTimeout(createPetal, i * 100);
    }
    setTimeout(() => setShowCelebration(false), 5000);
  };

  const handleScroll = (e) => {
    const form = formRef.current;
    if (form) {
      const delta = e.deltaY;
      form.scrollTop += delta;
    }
  };

  useEffect(() => {
    const form = formRef.current;
    if (form) {
      form.addEventListener('wheel', handleScroll, { passive: true });
    }
    return () => {
      if (form) {
        form.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setFileNames(prev => ({ ...prev, [type]: file.name }));
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (type, e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setFileNames(prev => ({ ...prev, [type]: file.name }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!files.pdf || !files.thumbnail) {
      setError('Please select both PDF and thumbnail files');
      return;
    }

    if (!metadata.name || !metadata.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', files.pdf);
    formData.append('thumbnail', files.thumbnail);
    formData.append('name', metadata.name);
    formData.append('category', metadata.category);
    formData.append('description', metadata.description);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      celebrate();
      setTimeout(() => {
        onSuccess(response.data);
        onClose();
        setFiles({ pdf: null, thumbnail: null });
        setFileNames({ pdf: '', thumbnail: '' });
        setMetadata({ name: '', category: '', description: '' });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-popup-overlay">
      <div className="upload-popup">
        <div className="upload-popup-header">
          <h2 className="upload-popup-title">Upload New File</h2>
          <button onClick={onClose} className="upload-popup-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-popup-form" ref={formRef}>
          {['pdf', 'thumbnail'].map((type) => (
            <div key={type} className="form-group">
              <label className="form-label">{type.toUpperCase()} File {type === 'pdf' ? '(PDF only)' : '(Image only)'} *</label>
              <div
                className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(type, e)}
                onClick={() => fileInputRefs[type].current.click()}
              >
                <svg className="file-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Drag & drop your {type} file here or click to browse</p>
                <input
                  type="file"
                  ref={fileInputRefs[type]}
                  onChange={(e) => handleFileChange(type, e)}
                  accept={type === 'pdf' ? '.pdf' : 'image/*'}
                  style={{ display: 'none' }}
                />
              </div>
              
              {fileNames[type] && (
                <div className="selected-file">
                  <span className="selected-file-name">{fileNames[type]}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles(prev => ({ ...prev, [type]: null }));
                      setFileNames(prev => ({ ...prev, [type]: '' }));
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              value={metadata.name}
              onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter file name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <input
              type="text"
              className="form-input"
              value={metadata.category}
              onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              placeholder="Enter description"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                Uploading...
              </>
            ) : 'Upload File'}
          </button>

          {isUploading && (
            <div className="upload-progress">
              <div className="upload-progress-bar" style={{ width: '60%' }}></div>
            </div>
          )}
        </form>

        {showCelebration && (
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Upload Successful!</h3>
            <p>Your file has been uploaded successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPopup;