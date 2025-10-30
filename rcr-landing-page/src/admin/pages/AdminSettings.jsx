// src/admin/pages/AdminSettings.jsx
import React, { useState } from 'react';
import './AdminDashboard.css'; // Shared admin styles
import '../../pages/AuthForm.css'; // Reuse auth form styles
import adminAvatar from '../../assets/avatars/avatar2.png'; // Placeholder

const AdminSettings = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <h1>Admin Settings</h1>
      </div>

      {/* --- Admin Profile Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Profile Information</h3>
          <p>Update your admin profile details.</p>
        </div>
        <div className="settings-section-content">
          <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <img src={adminAvatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
            <button className="admin-btn-secondary">Change Profile Picture</button>
          </div>
          <div className="form-group">
            <label htmlFor="adminName">Full Name</label>
            <input type="text" id="adminName" value="Admin" />
          </div>
          <div className="form-group">
            <label htmlFor="adminEmail">Email Address</label>
            <input type="email" id="adminEmail" value="admin@rcr.org" />
          </div>
          <button className="admin-btn-primary" style={{ marginTop: '10px' }}>Save Profile</button>
        </div>
      </section>

      {/* --- Change Password Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Change Password</h3>
          <p>Keep your admin account secure.</p>
        </div>
        <div className="settings-section-content">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input type="password" id="confirmNewPassword" />
          </div>
          <button className="admin-btn-primary" style={{ marginTop: '10px' }}>Update Password</button>
        </div>
      </section>

      {/* --- Platform Settings Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Platform Settings</h3>
          <p>Manage global settings for the entire application.</p>
        </div>
        <div className="settings-section-content">
          <div className="toggle-switch">
            <label>Enable Maintenance Mode</label>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isMaintenance} 
                onChange={() => setIsMaintenance(!isMaintenance)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-secondary)', marginTop: '10px' }}>
            When enabled, non-admin users will be unable to log in.
          </p>
          <br />
          <div className="form-group">
            <label>New Counsellor Applications</label>
            <select>
              <option value="open">Open (Allow new applications)</option>
              <option value="closed">Closed (Temporarily disable new applications)</option>
            </select>
          </div>
          <button className="admin-btn-primary" style={{ marginTop: '10px' }}>Save Platform Settings</button>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;