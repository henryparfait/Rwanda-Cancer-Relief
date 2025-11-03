// src/dashboard/DashboardLayout.jsx

import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import './DashboardLayout.css';
import rcrLogo from '../assets/partners/rcr.png'; // Using our existing logo
import profilePic from '../assets/avatars/avatar4.png'; // This will be dynamic later
import { FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';

// UPDATED: The component now accepts a 'navLinks' prop
const DashboardLayout = ({ navLinks }) => {
  return (
    <div className="dashboard-layout">
      {/* --- Sidebar --- */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src={rcrLogo} alt="RCR Logo" className="sidebar-logo" />
        </div>
        <ul className="sidebar-nav">
          {/* UPDATED: We now map over the 'navLinks' prop */}
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>
                {link.icon}<span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <Link to="/login" className="sidebar-logout-btn">
            <FaSignOutAlt /><span>Logout</span>
          </Link>
        </div>         
      </nav>

      {/* --- Main Content Area --- */}
      <div className="main-content">
        {/* --- Top Bar --- */}
        <header className="topbar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search resources, sessions..." />
          </div>
          <div className="topbar-right">
            <button className="notification-btn">
              <FaBell />
              <span>Notifications</span>
            </button>
            <div className="profile-badge">
              <img src={profilePic} alt="Profile" />
            </div>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="page-content">
          <Outlet /> {/* Child pages will be rendered here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;