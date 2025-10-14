// src/components/Footer.jsx

import React from 'react';
import './Footer.css';
import rcrLogo from '../assets/partners/rcr.png'; // Your logo
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Automatically gets the current year

  return (
    <footer className="footer">
      <div className="container">
        {/* Top Section: Logo, About, and Quick Nav */}
        <div className="footer-top">
          <div className="footer-about">
            <a href="#home" className="footer-logo">
              <img src={rcrLogo} alt="Rwanda Cancer Relief" />
            </a>
            <p>Providing compassionate, accessible, and meaningful support to cancer patients and their families across Rwanda.</p>
          </div>
          <div className="footer-main-nav">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
        
        <div className="footer-divider"></div>

        {/* Middle Section: Contact Details */}
        <div className="footer-middle">
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>+250 786 525 322</p>
            <p>director@rwandacancer.org</p>
          </div>
          <div className="footer-column">
            <h4>Location</h4>
            <p>KK 84B St, Kigali, Rwanda</p>
            <p>EVA PLAZA</p>
          </div>
          <div className="footer-column">
            <h4>Languages</h4>
            <p>Kinyarwanda, English, French</p>
          </div>
        </div>

        {/* Bottom Section: Socials and Copyright */}
        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="https://wa.me/qr/VT7JTGSHYPRBC1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
            <a href="https://x.com/rwcancerrelief" target="_blank" rel="noopener noreferrer" aria-label="X"><BsTwitterX /></a>
            <a href="https://www.instagram.com/rwcancerrelief/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/rwanda-cancer-relief" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <div className="footer-copyright">
            <p>© {currentYear} Rwanda Cancer Relief. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;