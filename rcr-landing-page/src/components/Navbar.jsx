// src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. IMPORT LINK COMPONENT
import './Navbar.css';
import logo from '../assets/partners/rcr.png'; // Ensure you have a logo image in the assets folder

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo now links back to the homepage */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Rwanda Cancer Relief Logo" />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <a href="/#about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="/#all-about-cancer" className="nav-link">All About Cancer</a>
          </li>
          <li className="nav-item">
            <a href="/#counselors" className="nav-link">Counselors</a>
          </li>
        </ul>
        
        {/* 2. DESKTOP SIGNUP BUTTON IS NOW A LINK */}
        <Link to="/signup" className="nav-signup-btn">
          Signup
        </Link>

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <ul className={isMobileMenuOpen ? 'nav-menu-mobile active' : 'nav-menu-mobile'}>
        <li className="nav-item-mobile">
          <Link to="/" className="nav-link" onClick={toggleMobileMenu}>Home</Link>
        </li>
        <li className="nav-item-mobile">
          <a href="/#about" className="nav-link" onClick={toggleMobileMenu}>About</a>
        </li>
        <li className="nav-item-mobile">
          <a href="/#all-about-cancer" className="nav-link" onClick={toggleMobileMenu}>All About Cancer</a>
        </li>
        <li className="nav-item-mobile">
          <a href="/#counselors" className="nav-link" onClick={toggleMobileMenu}>Counselors</a>
        </li>
        <li className="nav-item-mobile">
            {/* 3. MOBILE SIGNUP BUTTON IS NOW A LINK */}
            <Link to="/signup" className="nav-signup-btn-mobile" onClick={toggleMobileMenu}>
              Signup
            </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;