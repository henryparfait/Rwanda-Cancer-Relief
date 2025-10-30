// src/dashboard/DashboardLayout.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './DashboardLayout.css';
import rcrLogo from '../assets/partners/rcr.png'; // Using our existing logo
import profilePic from '../assets/avatars/avatar2.png'; // Placeholder for counselor's pic
import { 
  FaThLarge, FaUsers, FaCalendarAlt, FaCommentAlt, 
  FaBook, FaCog, FaSearch, FaBell 
} from 'react-icons/fa';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      {/* --- Sidebar --- */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src={rcrLogo} alt="RCR Logo" className="sidebar-logo" />
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/dashboard/overview">
              <FaThLarge /><span>Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/patients">
              <FaUsers /><span>My Patients</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/sessions">
              <FaCalendarAlt /><span>Session Management</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/messages">
              <FaCommentAlt /><span>Messages</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/library">
              <FaBook /><span>Resource Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings">
              <FaCog /><span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* --- Main Content Area --- */}
      <div className="main-content">
        {/* --- Top Bar --- */}
        <header className="topbar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search patients, sessions..." />
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