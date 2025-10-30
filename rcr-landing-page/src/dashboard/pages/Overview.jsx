// src/dashboard/pages/Overview.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPages.css';
import welcomeImage from '../../assets/welcome-banner.png'; // 1. Add this image
import { FaUsers, FaCalendarAlt, FaPlay, FaCommentDots } from 'react-icons/fa';

const Overview = () => {
  return (
    <div className="overview-page">
      {/* --- Welcome Banner --- */}
      <div className="welcome-banner">
        <div className="welcome-banner-text">
          <h2>Welcome Back, John Moses!</h2>
          <p>Therapy offers a profound opportunity for healing and growth.</p>
        </div>
        <div className="welcome-banner-image">
          <img src={welcomeImage} alt="Welcome" />
        </div>
      </div>

      {/* --- Quick Actions --- */}
      <h3 className="page-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        <Link to="/dashboard/patients" className="action-card">
          <div className="action-card-icon"><FaUsers /></div>
          <div className="action-card-text">
            <h3>My Patients</h3>
            <p>View and manage all assigned patients, their profiles, and history.</p>
          </div>
        </Link>
        
        <Link to="/dashboard/sessions" className="action-card">
          <div className="action-card-icon"><FaCalendarAlt /></div>
          <div className="action-card-text">
            <h3>Upcoming Sessions</h3>
            <p>See your schedule and prepare for next appointments.</p>
          </div>
        </Link>
        
        <Link to="/dashboard/sessions" className="action-card">
          <div className="action-card-icon"><FaPlay /></div>
          <div className="action-card-text">
            <h3>Start New Session</h3>
            <p>Begin a new counselling session with any patient.</p>
          </div>
        </Link>
        
        <Link to="/dashboard/messages" className="action-card">
          <div className="action-card-icon"><FaCommentDots /></div>
          <div className="action-card-text">
            <h3>Patient Messages</h3>
            <p>Check and respond to messages from your patients.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Overview;