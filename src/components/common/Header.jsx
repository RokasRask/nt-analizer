import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Sledge scroll pozicijos
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
  
  // Mobilaus meniu perjungimas
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/assets/images/logo.svg" alt="NT Analizė" />
            <span className="logo-text">NT <span>Analizė</span></span>
          </Link>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        <nav className="nav-menu">
          <NavLink to="/" end>
            Pradžia
          </NavLink>
          <NavLink to="/map">
            Žemėlapis
          </NavLink>
          <NavLink to="/analytics">
            Statistika
          </NavLink>
          <NavLink to="/comparison">
            Palyginimas
          </NavLink>
          <NavLink to="/about">
            Apie projektą
          </NavLink>
        </nav>
      </div>
      
      {mobileMenuOpen && (
        <div className="mobile-nav-menu open">
          <NavLink to="/" end onClick={toggleMobileMenu}>
            Pradžia
          </NavLink>
          <NavLink to="/map" onClick={toggleMobileMenu}>
            Žemėlapis
          </NavLink>
          <NavLink to="/analytics" onClick={toggleMobileMenu}>
            Statistika
          </NavLink>
          <NavLink to="/comparison" onClick={toggleMobileMenu}>
            Palyginimas
          </NavLink>
          <NavLink to="/about" onClick={toggleMobileMenu}>
            Apie projektą
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;