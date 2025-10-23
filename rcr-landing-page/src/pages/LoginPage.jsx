// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigating to signup
import AuthLayout from '../components/AuthLayout';
import './AuthForm.css'; // A shared CSS file for both login and signup
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here is where you would handle the login logic (e.g., call an API)
    console.log('Logging in with:', { email, password });
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-title">Welcome Back!</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email<span className="required-asterisk">*</span></label>
            <input
              type="email"
              id="email"
              placeholder="Your Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password<span className="required-asterisk">*</span></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          
          <div className="form-options">
             <a href="#" className="forgot-password-link">Forgot Password?</a>
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="auth-switch-prompt">
          Don't have an account? <Link to="/choose-role" className="auth-link">SignUp</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;