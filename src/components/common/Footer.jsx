import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/about">Apie projektą</Link>
          <Link to="/privacy">Privatumo politika</Link>
          <a href="https://github.com/rokasrask/nt-analize" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
        
        <div className="copyright">
          &copy; {currentYear} NT Analizė | Duomenys renkami iš viešai prieinamų šaltinių
        </div>
      </div>
    </footer>
  );
};

export default Footer;