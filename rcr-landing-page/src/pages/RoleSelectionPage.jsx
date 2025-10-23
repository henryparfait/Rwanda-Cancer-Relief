// src/pages/RoleSelectionPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './RoleSelectionPage.css';
import rcrLogo from '../assets/logo.png'; // Using the large logo
import { FaUserMd, FaUser } from 'react-icons/fa'; // Icons for counselor and patient

const RoleSelectionPage = () => {
  return (
    <div className="role-container">
      <div className="role-card">
        <img src={rcrLogo} alt="Rwanda Cancer Relief" className="role-logo" />
        <h2 className="role-title">Join Our Community</h2>
        <p className="role-subtitle">
          Please select your role to get started with a tailored experience.
        </p>

        <div className="role-options">
          <Link to="/signup/patient" className="role-option-card">
            <FaUser className="role-icon" />
            <h3>I am a Patient</h3>
            <p>Access resources, schedule sessions, and connect with counselors.</p>
          </Link>
          
          <Link to="/signup/counselor" className="role-option-card">
            <FaUserMd className="role-icon" />
            <h3>I am a Counselor</h3>
            <p>Manage your schedule, connect with patients, and provide support.</p>
          </Link>
        </div>

        <p className="role-switch-prompt">
          Already have an account? <Link to="/login" className="role-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionPage;