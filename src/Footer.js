import React from 'react';

const styles = `
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ffffff;
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

.footer-text {
  font-size: 0.9rem;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
}

.wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 150px;
  animation: wave-animation 10s ease-in-out infinite;
}

.wave svg path {
  fill: #2c3e50;
}

@keyframes wave-animation {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(0);
  }
}
`;

const Footer = () => {
  return (
    <>
      <style>{styles}</style>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/about" className="footer-link">About</a>
            <a href="/services" className="footer-link">Services</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
          <div className="footer-text">
            &copy; 2024 Solvebuddy. All rights reserved.
          </div>
        </div>
        <div className="wave">
          <svg viewBox="0 0 1200 150" preserveAspectRatio="none">
            <path d="M0,0V150H1200V0Z" />
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;