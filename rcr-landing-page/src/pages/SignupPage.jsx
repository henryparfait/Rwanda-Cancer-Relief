// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  const { role } = useParams();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    dob: '',
    district: '',
    telephone: '',
    cancerType: '',
    profilePic: null,
    cv: null, // NEW: Added CV
    medicalLicense: null, // NEW: Added License
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  // UPDATED: This function now handles ALL file inputs dynamically
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0] || null // Store the first file, or null if empty
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Submitting form data:', { ...formData, role: role });
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-title">
          Create {role === 'patient' ? 'Patient' : 'Counselor'} Account
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Telephone</label>
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder='07...' required />
            </div>
          </div>

          {/* Conditional field for patients */}
          {role === 'patient' && (
            <div className="form-group">
              <label>Type of Cancer (if diagnosed)</label>
              <select name="cancerType" value={formData.cancerType} onChange={handleChange}>
                <option value="">Select type (if applicable)</option>
                <option value="breast">Breast Cancer</option>
                <option value="prostate">Prostate Cancer</option>
                <option value="lung">Lung Cancer</option>
                <option value="cervical">Cervical Cancer</option>
                <option value="colon">Colon Cancer</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* NEW: Conditional fields for counselors */}
          {role === 'counselor' && (
            <>
              <div className="form-group">
                <label>Upload your CV (PDF/DOC)</label>
                <input type="file" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
              </div>
              <div className="form-group">
                <label>Upload your Medical License (PDF/JPG/PNG)</label>
                <input type="file" name="medicalLicense" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Profile Picture (PNG/JPG)</label>
            {/* UPDATED: Make sure this input has the correct 'name' prop */}
            <input type="file" name="profilePic" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle-icon">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>
          </div>

          <button type="submit" className="auth-button">Create Account</button>
        </form>
        
        <p className="auth-switch-prompt">
          Have an account? <Link to="/login" className="auth-link">LogIn</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;