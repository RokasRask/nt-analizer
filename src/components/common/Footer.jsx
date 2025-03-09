import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column footer-about">
              <div className="footer-logo">
                <img src="/assets/images/logo-white.svg" alt="NT Analizė" />
                <div className="logo-text">
                  <span className="logo-first">NT</span>
                  <span className="logo-second">Analizė</span>
                </div>
              </div>
              <p className="footer-about-text">
                NT Analizė - tai Lietuvos nekilnojamojo turto rinkos duomenų portalas, 
                padedantis vartotojams priimti informuotus sprendimus perkant, parduodant 
                ar investuojant į nekilnojamąjį turtą.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Navigacija</h3>
              <ul className="footer-links">
                <li><Link to="/">Pradžia</Link></li>
                <li><Link to="/map">Žemėlapis</Link></li>
                <li><Link to="/analytics">Statistika</Link></li>
                <li><Link to="/comparison">Palyginimas</Link></li>
                <li><Link to="/about">Apie projektą</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Informacija</h3>
              <ul className="footer-links">
                <li><Link to="/about">Apie mus</Link></li>
                <li><Link to="/privacy">Privatumo politika</Link></li>
                <li><Link to="/terms">Naudojimosi sąlygos</Link></li>
                <li><Link to="/data-sources">Duomenų šaltiniai</Link></li>
                <li><Link to="/faq">DUK</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Kontaktai</h3>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Gedimino pr. 1, Vilnius, Lietuva</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:info@nt-analize.lt">info@nt-analize.lt</a>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <a href="tel:+37060000000">+370 600 00000</a>
                </li>
              </ul>
              
              <div className="footer-subscribe">
                <h3 className="footer-title">Naujienlaiškis</h3>
                <form className="subscribe-form">
                  <input type="email" placeholder="Jūsų el. paštas" required />
                  <button type="submit">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <div className="footer-bottom-links">
              <Link to="/privacy">Privatumas</Link>
              <Link to="/terms">Sąlygos</Link>
              <Link to="/cookies">Slapukai</Link>
            </div>
            
            <div className="copyright">
              &copy; {currentYear} NT Analizė | Visos teisės saugomos
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;