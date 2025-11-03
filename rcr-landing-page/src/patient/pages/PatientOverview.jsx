// src/patient/pages/PatientOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import { FaTasks, FaUserMd, FaCalendarCheck, FaBook, FaUsers, FaBookOpen } from 'react-icons/fa';

const PatientOverview = () => {
  return (
    <div className="patient-overview-page">
      {/* --- Welcome Banner --- */}
      <div className="welcome-banner">
        <div className="welcome-banner-text">
          <h2>Welcome back, Jane Doe!</h2>
          <p>Your dashboard awaits. Let's make a positive impact today.</p>
        </div>
      </div>

      {/* --- Progress & Quick Access --- */}
      <h2 className="patient-section-title">Your Progress & Quick Access</h2>
      
      {/* --- Stats Grid --- */}
      <div className="progress-stats-grid">
        <StatCard icon={<FaTasks />} number="7/12" label="Modules Completed" />
        <StatCard icon={<FaUserMd />} number="2" label="Counsellors Connected" />
        <StatCard icon={<FaCalendarCheck />} number="4" label="Total Sessions" />
      </div>

      {/* --- Quick Access Grid --- */}
      <div className="patient-quick-access">
        <QuickAccessCard
          icon={<FaBookOpen />}
          title="Counselling Modules"
          description="Engage in self-paced modules to understand and cope with your journey."
          linkTo="/patient/resources"
          linkText="Go to Counselling"
        />
        <QuickAccessCard
          icon={<FaUsers />}
          title="One-on-One Consulting"
          description="Connect with certified counsellors for personalized support."
          linkTo="/patient/counsellors"
          linkText="Go to One-on-One"
        />
        <QuickAccessCard
          icon={<FaBook />}
          title="Resource Library"
          description="Access a wealth of articles, videos, and guides."
          linkTo="/patient/resources"
          linkText="Go to Resource Library"
        />
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, number, label }) => (
  <div className="progress-stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const QuickAccessCard = ({ icon, title, description, linkTo, linkText }) => (
  <Link to={linkTo} className="quick-access-card">
    <div className="quick-access-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="quick-access-link">{linkText} &gt;</span>
  </Link>
);

export default PatientOverview;