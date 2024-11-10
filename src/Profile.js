import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import './CustomerProfile.css';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      axios.get('http://localhost:5000/profile', { withCredentials: true })
        .then(response => {
          setUserData(response.data);
          setLoading(false);
          initProfileAnimation();
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    } else {
      setUsername('Guest');
      setLoading(false);
      initProfileAnimation();
    }
  }, []);

  const initProfileAnimation = () => {
    if (containerRef.current && nameRef.current && infoRef.current) {
      // Create GSAP timeline
      const tl = gsap.timeline({ delay: 0.5 });

      // Animate profile container
      tl.from(containerRef.current, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' });

      // Animate name
      tl.from(nameRef.current, { y: -50, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');

      // Animate user info
      tl.from(infoRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.1
      }, '-=0.3');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar/>
   
    <div className="profile-container" ref={containerRef}>
      <div className="profile-image">
        <img src="https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg" alt="Customer Profile" />
      </div>
      <h1 className="name" ref={nameRef}>Welcome, {username}!</h1>
      <div className="user-info" ref={infoRef}>
        <div className="info-item">
          <strong>Email:</strong> {userData.email}
        </div>
        <div className="info-item">
          <strong>Full Name:</strong> {userData.fullName || 'N/A'}
        </div>
        <div className="info-item">
          <strong>Account Created On:</strong> {new Date(userData.createdAt).toLocaleDateString()}
        </div>
        <div className="info-item">
          <strong>Premium Status:</strong> {userData.premiumStatus}
        </div>
        <div className="info-item">
          <strong>Uploaded Files:</strong> {userData.uploadedFilesCount}
        </div>
        <div className="info-item">
          <strong>Downloaded Files:</strong> {userData.downloadedFilesCount}
        </div>
      </div>
    </div>
    <br></br>
    <br></br>
    <Footer/>
    </>
  );
};

export default Profile;