// src/components/AuthLayout.jsx

import React from 'react';
import './AuthLayout.css';
import rcrLogo from '../assets/logo.png'; // You may need to create a larger version of your logo

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo-section">
          <img src={rcrLogo} alt="Rwanda Cancer Relief" />
        </div>
        <div className="auth-form-section">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;