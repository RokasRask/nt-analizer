import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <Link to="/">NT Analizė</Link>
        </div>
        
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
    </header>
  );
};

export default Header;