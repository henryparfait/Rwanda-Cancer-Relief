// src/admin/AdminLayout.jsx

import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import './AdminLayout.css'; // New CSS file
import rcrLogo from '../assets/partners/rcr.png'; // Using our existing logo
import adminAvatar from '../assets/avatars/avatar2.png'; // Placeholder
import {
  FaThLarge, FaUsers, FaTasks, FaChartBar,
  FaBook, FaCheckSquare, FaComments, FaCog,
  FaBell, FaPlus, FaSignOutAlt
} from 'react-icons/fa';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* --- Admin Sidebar --- */}
      <nav className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src={rcrLogo} alt="RCR Logo" className="admin-sidebar-logo" />
        </div>
        <ul className="admin-sidebar-nav">
          <li>
            <NavLink to="/admin/overview"><FaThLarge /><span>Overview</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/users"><FaUsers /><span>User Management</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/sessions"><FaTasks /><span>Session Oversight</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/reports"><FaChartBar /><span>Reports & Insights</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/resources"><FaBook /><span>Resource Management</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/approval"><FaCheckSquare /><span>Approval Center</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/messages"><FaComments /><span>Messaging</span></NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings"><FaCog /><span>Settings</span></NavLink>
          </li>
        </ul>
        <div className="admin-sidebar-logout">
          <Link to="/login" className="admin-logout-btn">
            <FaSignOutAlt /><span>Logout</span>
          </Link>
        </div>
        <div className="admin-sidebar-footer">
          <a href="#">Quick Links</a>
          <a href="#">Support</a>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <div className="admin-main-content">
        {/* --- Top Bar --- */}
        <header className="admin-topbar">
          {/* Note: The secondary nav from your designs will be handled by page-level tabs */}
          <div className="admin-topbar-left">
            {/* This could be a breadcrumb or page title */}
          </div>
          <div className="admin-topbar-right">
            <button className="admin-notification-btn">
              <FaBell />
            </button>
            <button className="admin-add-btn">
              <FaPlus />
            </button>
            <div className="admin-profile-badge">
              <img src={adminAvatar} alt="Admin" />
            </div>
          </div>
        </header>

        {/* --- Page Content --- */}
        <main className="admin-page-content">
          <Outlet /> {/* Child pages will be rendered here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;