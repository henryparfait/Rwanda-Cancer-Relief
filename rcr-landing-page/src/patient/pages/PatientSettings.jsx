// src/patient/pages/PatientSettings.jsx
import React, { useState } from 'react';
import './PatientDashboard.css'; // Shared patient styles
import '../../pages/AuthForm.css'; // Reuse auth form styles
import userAvatar from '../../assets/avatars/avatar4.png'; // Placeholder

const PatientSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="settings-page" style={{ maxWidth: '800px' }}>
      {/* --- Page Header --- */}
      <div className="patient-page-header">
        <h1>Settings</h1>
      </div>

      {/* --- Profile Information Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Profile Information</h3>
          <p>Update your personal details and profile picture.</p>
        </div>
        <div className="settings-section-content">
          <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <img src={userAvatar} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
            <button className="admin-btn-secondary">Change Profile Picture</button>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value="Jane" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value="Doe" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value="jane.doe@example.com" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" id="dob" value="1990-05-15" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" value="+250 788 456 789" />
            </div>
          </div>
          <button className="admin-btn-primary" style={{ marginTop: '10px' }}>Save Profile</button>
        </div>
      </section>

      {/* --- Change Password Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Change Password</h3>
          <p>Keep your account secure.</p>
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

      {/* --- Notification Preferences Section --- */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h3>Notification Preferences</h3>
          <p>Manage how you receive alerts and updates.</p>
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
              <label htmlFor="emailNotif">Email Notifications for new messages</label>
            </div>
            <div className="checkbox-item">
              <input 
                type="checkbox" 
                id="smsNotif" 
                name="sms"
                checked={notifications.sms}
                onChange={handleNotificationChange}
              />
              <label htmlFor="smsNotif">SMS Reminders for upcoming sessions</label>
            </div>
          </div>
          <button className="admin-btn-primary" style={{ marginTop: '10px' }}>Save Notifications</button>
        </div>
      </section>
    </div>
  );
};

export default PatientSettings;