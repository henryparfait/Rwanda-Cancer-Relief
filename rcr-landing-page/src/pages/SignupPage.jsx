// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  // State to manage which step of the form is active
  const [step, setStep] = useState(1);

  // State to hold all the form data in one object
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    ageRange: '',
    country: '',
    city: '',
    district: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // A single handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    // We could add validation here before proceeding
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle the final form submission (e.g., API call)
    console.log('Submitting form data:', formData);
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-title">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              {/* --- STEP 1 FIELDS --- */}
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age Range</label>
                <select name="ageRange" value={formData.ageRange} onChange={handleChange} required>
                  <option value="">Select Age Range</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" value={formData.country} onChange={handleChange} required>
                   <option value="">Select Country</option>
                   <option value="rwanda">Rwanda</option>
                </select>
              </div>
              <button type="button" onClick={handleNextStep} className="auth-button">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              {/* --- STEP 2 FIELDS --- */}
              <div className="form-group">
                <label>City/Province</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your City/Province" required />
              </div>
              <div className="form-group">
                <label>District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="Your District" required />
              </div>
              <div className="form-group">
                <label>Telephone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+250..." required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                  <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={handlePrevStep} className="auth-button" style={{ backgroundColor: '#6c757d' }}>Back</button>
                <button type="submit" className="auth-button">SignUp</button>
              </div>
            </>
          )}
        </form>
        
        <p className="auth-switch-prompt">
          Have an account? <Link to="/login" className="auth-link">LogIn</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;