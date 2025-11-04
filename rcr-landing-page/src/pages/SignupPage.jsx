// src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './AuthForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();

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
    cv: null, 
    medicalLicense: null,
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // Frontend validation
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setIsLoading(false);
    return;
  }
  
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters long');
    setIsLoading(false);
    return;
  }

  try {
    // Create FormData instead of JSON
    const formDataToSend = new FormData();
    
    // Add all text fields
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('district', formData.district);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('confirmPassword', formData.confirmPassword);
    formDataToSend.append('role', role);
    
    // Add cancerType for patients
    if (role === 'patient') {
      formDataToSend.append('cancerType', formData.cancerType || '');
    }

    // Add files if they exist
    if (formData.profilePic) {
      formDataToSend.append('profilePic', formData.profilePic);
    }
    if (formData.cv) {
      formDataToSend.append('cv', formData.cv);
    }
    if (formData.medicalLicense) {
      formDataToSend.append('medicalLicense', formData.medicalLicense);
    }

    console.log('Submitting form data with files...');

    // Call backend API with FormData 
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      body: formDataToSend, // Send FormData instead of JSON

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      if (data.data.profile) {
        localStorage.setItem('profile', JSON.stringify(data.data.profile));
      }

      console.log('Registration successful:', data);

      // Show success message from backend
      alert(data.message);

      // Handle redirection based on approval status
      if (data.data.user.isApproved) {
        // If approved, go to dashboard
        if (data.data.user.role === 'patient') {
          navigate('/patient/dashboard');
        } else if (data.data.user.role === 'counselor') {
          navigate('/counselor/dashboard');
        }
      } else {
        // If pending approval, go to login with message
        navigate('/login', {
          state: { 
            message: 'Your account is pending approval. You will be notified once approved.' 
          }
        });
      }
    }
  } catch (error) {
    console.error('Signup error:', error);
    setError(error.message || 'Network error. Please check if backend is running on port 5000.');
  } finally {
    setIsLoading(false);
  }
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