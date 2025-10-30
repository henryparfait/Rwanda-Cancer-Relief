// src/dashboard/pages/Settings.jsx
import React, { useState } from 'react';
import './DashboardPages.css'; // Shared dashboard styles
import '../../pages/AuthForm.css'; // Reuse auth form styles
import { FaUpload } from 'react-icons/fa';
import profilePic from '../../assets/avatars/avatar2.png'; // Placeholder

const Settings = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    message: true,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="settings-page">
      {/* --- Page Header --- */}
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {/* --- Profile Information Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Profile Information</h3>
          <p>Update your professional details and profile picture.</p>
        </div>
        <div className="settings-section-content">
          <div className="form-group-inline">
            <img src={profilePic} alt="Profile" className="profile-pic-preview" />
            <button className="btn btn-secondary-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUpload /> Change Profile Picture
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" value="Jane Doe" />
          </div>
          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <select id="specialization" defaultValue="oncology">
              <option value="oncology">Oncology Counseling</option>
              <option value="grief">Grief Counseling</option>
              <option value="family">Family Support</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="aboutMe">About Me</label>
            <textarea id="aboutMe" rows="4" placeholder="Dedicated to providing compassionate support..."></textarea>
          </div>
          <button className="btn btn-primary-solid settings-save-button">Save Profile</button>
        </div>
      </section>

      {/* --- Availability Status Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Availability Status</h3>
          <p>Control your online presence and availability for new requests.</p>
        </div>
        <div className="settings-section-content">
          <div className="toggle-switch">
            <label>Set to Available</label>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isAvailable} 
                onChange={() => setIsAvailable(!isAvailable)} 
              />
              <span className="slider"></span>
            </label>
          </div>
          <button className="btn btn-primary-solid settings-save-button">Save Availability</button>
        </div>
      </section>

      {/* --- Change Password Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Change Password</h3>
          <p>Keep your account secure by updating your password periodically.</p>
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
          <button className="btn btn-primary-solid settings-save-button">Update Password</button>
        </div>
      </section>

      {/* --- Contact Information Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Contact Information</h3>
          <p>Update your verified email and phone number for communication.</p>
        </div>
        <div className="settings-section-content">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value="jane.doe@rcr.org" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" value="+250 788 123 456" />
          </div>
          <button className="btn btn-primary-solid settings-save-button">Update Contact Info</button>
        </div>
      </section>

      {/* --- Notification Preferences Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Notification Preferences</h3>
          <p>Manage how you receive alerts and updates from the dashboard.</p>
        </div>
        <div className="settings-section-content">
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="emailNotif" 
                name="email"
                checked={notifications.email}
                onChange={handleNotificationChange}
              />
              <label htmlFor="emailNotif">Email Notifications</label>
            </div>
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="smsNotif" 
                name="sms"
                checked={notifications.sms}
                onChange={handleNotificationChange}
              />
              <label htmlFor="smsNotif">SMS Reminders</label>
            </div>
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="messageNotif" 
                name="message"
                checked={notifications.message}
                onChange={handleNotificationChange}
              />
              <label htmlFor="messageNotif">Message Reminders</label>
            </div>
          </div>
          <button className="btn btn-primary-solid settings-save-button">Save Notifications</button>
        </div>
      </section>
    </div>
  );
};

export default Settings;