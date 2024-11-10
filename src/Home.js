import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import Navbar from './Navbar'
import LoadingAnimation from './LoadingAnimation';
import FileUploadPopup from './FileUploadPopup';
import Footer from './Footer';
gsap.registerPlugin(ScrollTrigger);

const API_URL = "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [username, setUsername] = useState('');
  axios.defaults.withCredentials = true;
  
  const filesGridRef = useRef(null);
  const searchRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          setUsername('Guest');
        }
        
        const response = await axios.get(`${API_URL}/api/files`);
        console.log("fteched files from database",response.data.files)
        // Extract files array from the response
        if (response.data && response.data.success && Array.isArray(response.data.files)) {
          setFiles(response.data.files);
        } else {
          console.error("Invalid response format:", response.data);
          setFiles([]); // Set empty array if invalid response
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setFiles([]); // Set empty array on error
      } finally {
        setTimeout(() => {
          setLoading(false);
          setLoadingComplete(true);
        }, 1000);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    // Initial animations
    gsap.from('.page-title', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from(searchRef.current, {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.3
    });

    // Animate file cards on scroll
    const cards = gsap.utils.toArray('.file-card');
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        y: 60,
        opacity: 0,
        ease: 'power3.out',
        delay: i * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loadingComplete]);

  // Sidebar animation
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        duration: 0.5,
        x: isSidebarOpen ? 300 : 0,
        ease: 'power3.inOut'
      });
    }
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/logout`, { withCredentials: true });
      if (res.data.status) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  // Add the missing functions
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const animateCardHover = (card, isEntering) => {
    gsap.to(card, {
      duration: 0.3,
      scale: isEntering ? 1.02 : 1,
      y: isEntering ? -8 : 0,
      boxShadow: isEntering 
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      ease: 'power2.out'
    });
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      const card = document.querySelector(`[data-file-id="${fileId}"]`);
      
      gsap.to(card, {
        duration: 0.5,
        scale: 0.9,
        opacity: 0,
        y: -20,
        ease: 'power3.in',
        onComplete: async () => {
          try {
            await axios.get(`${API_URL}/filesdelete/${fileId}`, {
              withCredentials: true
            });
            setFiles(files.filter((file) => file.id !== fileId));
          } catch (err) {
            console.error("Error deleting file:", err);
            // Reverse animation if delete fails
            gsap.to(card, {
              duration: 0.5,
              scale: 1,
              opacity: 1,
              y: 0,
              ease: 'power3.out'
            });
          }
        }
      });
    }
  };

  // Filter files based on search query
  const filteredFiles = files && Array.isArray(files) ? files.filter(file => 
    (file.category && file.category.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (file.originalName && file.originalName.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).filter(file => file.url && file.url.toLowerCase().includes('.pdf')) : [];

  if (loading && !loadingComplete) {
    return <LoadingAnimation />;
  }

  return (
    <>
    <div className="home-container">
      {/* Keep all existing JSX structure */}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Navbar/>
        <br/>
      
        <div className={`menu-button ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div 
          ref={searchRef}
          className={`search-container ${searchFocused ? 'focused' : ''}`}
        >
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Search by category or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="search-input"
          />
        </div>

        <div className="files-container">
          <h2 className="section-title">Available Notes</h2>
          {filteredFiles.length === 0 ? (
            <p className="no-files">No files found.</p>
          ) : (
            <div ref={filesGridRef} className="files-grid">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  data-file-id={file.id}
                  className="file-card"
                  onMouseEnter={(e) => animateCardHover(e.currentTarget, true)}
                  onMouseLeave={(e) => animateCardHover(e.currentTarget, false)}
                >
                  <div className="file-thumbnail">
                    <img 
                      src={file.thumbnailUrl}
                      alt={file.originalName}
                      onError={(e) => { e.target.src = '/path/to/default-thumbnail.jpg'; }}
                    />
                  </div>
                  <div className="file-info">
                    <Link to={`/files/${file.id}`} className="file-name">
                      {file.originalName}
                    </Link>
                    <p className="file-description">Description: {file.description || 'No description available'}</p>
                    <br/>
                    <p className="file-category">Category: {file.category || 'No category assigned'}</p>
                    <br/>
                    
                    <div className="rating-info">
                      <span className="rating-stars">
                        {'⭐'.repeat(Math.round(file.averageRating || 0))}
                      </span>
                      <span className="rating-count">({file.totalRatings || 0} ratings)</span>
                      <br/>
                      <br/>
                    </div>

                    <button 
                      onClick={() => handleDelete(file.id)} 
                      className="delete-button"
                      aria-label={`Delete ${file.originalName}`}
                    >
                      <i className="fas fa-trash"></i>Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      <FileUploadPopup 
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
        onSuccess={(data) => {
          setFiles(prevFiles => [...prevFiles, data]);
        }}
      />
    </div>
    <Footer/>
    </>
  );
};

export default Home;