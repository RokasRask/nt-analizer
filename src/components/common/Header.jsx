import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../../styles/components/_header.scss';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Prevent body scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'visible';
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/assets/images/logo.svg" alt="NT Analizė" className="logo-img" />
            <div className="logo-text">
              <span className="logo-first">NT</span>
              <span className="logo-second">Analizė</span>
            </div>
          </Link>
        </div>
        
        <nav className="desktop-nav">
          <NavLink to="/" end>
            <i className="fas fa-home"></i>
            <span>Pradžia</span>
          </NavLink>
          <NavLink to="/map">
            <i className="fas fa-map-marker-alt"></i>
            <span>Žemėlapis</span>
          </NavLink>
          <NavLink to="/analytics">
            <i className="fas fa-chart-line"></i>
            <span>Statistika</span>
          </NavLink>
          <NavLink to="/comparison">
            <i className="fas fa-balance-scale"></i>
            <span>Palyginimas</span>
          </NavLink>
          <NavLink to="/about">
            <i className="fas fa-info-circle"></i>
            <span>Apie projektą</span>
          </NavLink>
        </nav>
        
        <div className="header-actions">
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
          <button className="theme-button">
            <i className="fas fa-moon"></i>
          </button>
          <button className="menu-toggle" onClick={toggleMobileMenu}>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </button>
        </div>
      </div>
      
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <nav className="mobile-nav">
            <NavLink to="/" end onClick={closeMenu}>
              <i className="fas fa-home"></i>
              <span>Pradžia</span>
            </NavLink>
            <NavLink to="/map" onClick={closeMenu}>
              <i className="fas fa-map-marker-alt"></i>
              <span>Žemėlapis</span>
            </NavLink>
            <NavLink to="/analytics" onClick={closeMenu}>
              <i className="fas fa-chart-line"></i>
              <span>Statistika</span>
            </NavLink>
            <NavLink to="/comparison" onClick={closeMenu}>
              <i className="fas fa-balance-scale"></i>
              <span>Palyginimas</span>
            </NavLink>
            <NavLink to="/about" onClick={closeMenu}>
              <i className="fas fa-info-circle"></i>
              <span>Apie projektą</span>
            </NavLink>
          </nav>
          
          <div className="mobile-footer">
            <div className="social-links">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="mobile-contact">
              <p><i className="fas fa-envelope"></i> info@nt-analize.lt</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;