import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@') && email.includes('.')) {
      setSubscribed(true);
      setEmail('');
      // In a real app, you would send this to an API
      console.log('Subscribed email:', email);
      
      // Reset the subscribed state after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-wave"></div>
      
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column footer-brand">
            <div className="footer-logo">
              <img src="/assets/images/logo-white.svg" alt="NT Analizė" className="footer-logo-image" />
              <div className="footer-logo-text">
                <span className="logo-primary">NT</span> 
                <span className="logo-secondary">Analizė</span>
              </div>
            </div>
            
            <p className="footer-about-text">
              NT Analizė - tai Lietuvos nekilnojamojo turto rinkos duomenų portalas, 
              padedantis vartotojams priimti informuotus sprendimus perkant, parduodant 
              ar investuojant į nekilnojamąjį turtą.
            </p>
            
            <div className="footer-social">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <span className="social-icon facebook-icon"></span>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <span className="social-icon twitter-icon"></span>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <span className="social-icon linkedin-icon"></span>
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <span className="social-icon github-icon"></span>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">Navigacija</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Pradžia</Link></li>
              <li><Link to="/map" className="footer-link">Žemėlapis</Link></li>
              <li><Link to="/analytics" className="footer-link">Statistika</Link></li>
              <li><Link to="/comparison" className="footer-link">Palyginimas</Link></li>
              <li><Link to="/about" className="footer-link">Apie projektą</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">Informacija</h3>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">Apie mus</Link></li>
              <li><Link to="/privacy" className="footer-link">Privatumo politika</Link></li>
              <li><Link to="/terms" className="footer-link">Naudojimosi sąlygos</Link></li>
              <li><Link to="/data-sources" className="footer-link">Duomenų šaltiniai</Link></li>
              <li><Link to="/faq" className="footer-link">DUK</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 className="footer-title">Kontaktai</h3>
            <ul className="footer-contact">
              <li className="contact-item location-item">
                <span className="contact-icon location-icon"></span>
                <span className="contact-text">Gedimino pr. 1, Vilnius, Lietuva</span>
              </li>
              <li className="contact-item email-item">
                <span className="contact-icon email-icon"></span>
                <span className="contact-text">info@nt-analize.lt</span>
              </li>
              <li className="contact-item phone-item">
                <span className="contact-icon phone-icon"></span>
                <span className="contact-text">+370 600 00000</span>
              </li>
            </ul>
            
            <div className="footer-subscribe">
              <h3 className="subscribe-title">Prenumeruokite naujienas</h3>
              
              {!subscribed ? (
                <form className="subscribe-form" onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Jūsų el. paštas" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="subscribe-button">
                      <span className="subscribe-icon"></span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="subscribe-success">
                  <span className="success-icon"></span>
                  <p>Sėkmingai užsiprenumeravote naujienas!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-links">
            <Link to="/privacy" className="footer-bottom-link">Privatumas</Link>
            <Link to="/terms" className="footer-bottom-link">Sąlygos</Link>
            <Link to="/cookies" className="footer-bottom-link">Slapukai</Link>
          </div>
          
          <div className="copyright">
            &copy; {currentYear} NT Analizė | Visos teisės saugomos
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;