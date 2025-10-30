// src/admin/pages/AdminOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import { FaUsers, FaChartBar, FaCheckSquare, FaBook, FaUserMd, FaUserCheck, FaCalendarCheck, FaExclamationCircle } from 'react-icons/fa';

const AdminOverview = () => {
  return (
    <div className="admin-overview-page">
      <div className="admin-page-header">
        <h1>Welcome back, Admin.</h1>
      </div>

      <h3 className="page-title" style={{ fontSize: '20px' }}>Key Statistics</h3>
      <div className="stats-grid">
        <StatCard icon={<FaUserMd />} number="1,245" label="Total Patients" />
        <StatCard icon={<FaUserCheck />} number="87" label="Total Counsellors" />
        <StatCard icon={<FaCalendarCheck />} number="5,321" label="Sessions Completed" />
        <StatCard icon={<FaExclamationCircle />} number="12" label="Pending Approvals" />
      </div>

      <h3 className="page-title" style={{ fontSize: '20px' }}>Quick Actions</h3>
      <div className="admin-quick-actions">
        <Link to="/admin/users" className="admin-action-card">
          <FaUsers className="admin-action-icon" />
          <h3>Manage Users</h3>
        </Link>
        <Link to="/admin/reports" className="admin-action-card">
          <FaChartBar className="admin-action-icon" />
          <h3>View Reports</h3>
        </Link>
        <Link to="/admin/approval" className="admin-action-card">
          <FaCheckSquare className="admin-action-icon" />
          <h3>Approve Counsellors</h3>
        </Link>
        <Link to="/admin/resources" className="admin-action-card">
          <FaBook className="admin-action-icon" />
          <h3>Manage Resources</h3>
        </Link>
      </div>
    </div>
  );
};

// A helper component for the stat cards
const StatCard = ({ icon, number, label }) => (
  <div className="stat-card">
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default AdminOverview;