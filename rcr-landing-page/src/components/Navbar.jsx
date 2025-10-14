// src/components/Navbar.jsx

import React, { useState } from 'react';
import './Navbar.css'; // We will create this CSS file next
import logo from '../assets/partners/rcr.png'; // Make sure you have a logo in src/assets

const Navbar = () => {
  // State to manage whether the mobile navigation is open or closed
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu state
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Rwanda Cancer Relief Logo" />
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#home" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="#all-about-cancer" className="nav-link">All About Cancer</a>
          </li>
          <li className="nav-item">
            <a href="#counselors" className="nav-link">Counselors</a>
          </li>
        </ul>
        
        {/* Signup Button - Desktop */}
        <a href="#signup" className="nav-signup-btn">
          Signup
        </a>

        {/* Hamburger Menu Icon */}
        <div className="menu-icon" onClick={toggleMobileMenu}>
          {/* This creates the three lines for the hamburger icon */}
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {/* The 'active' class is added based on the isMobileMenuOpen state */}
      <ul className={isMobileMenuOpen ? 'nav-menu-mobile active' : 'nav-menu-mobile'}>
        <li className="nav-item-mobile">
          <a href="#home" className="nav-link" onClick={toggleMobileMenu}>Home</a>
        </li>
        <li className="nav-item-mobile">
          <a href="#about" className="nav-link" onClick={toggleMobileMenu}>About</a>
        </li>
        <li className="nav-item-mobile">
          <a href="#all-about-cancer" className="nav-link" onClick={toggleMobileMenu}>All About Cancer</a>
        </li>
        <li className="nav-item-mobile">
          <a href="#counselors" className="nav-link" onClick={toggleMobileMenu}>Counselors</a>
        </li>
        <li className="nav-item-mobile">
            <a href="#signup" className="nav-signup-btn-mobile" onClick={toggleMobileMenu}>
              Signup
            </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;