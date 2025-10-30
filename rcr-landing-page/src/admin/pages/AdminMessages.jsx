// src/admin/pages/AdminMessages.jsx
import React, { useState } from 'react';
import './AdminDashboard.css';
import { FaPaperPlane, FaBell, FaUser, FaUserMd, FaUsers, FaComments } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';

const inboxData = [
  { id: 1, icon: <img src={avatar1} alt="Dr. Alice" className="inbox-icon" />, title: 'Dr. Alice Muneza', time: '2 min ago', excerpt: 'Hello admin, I have a new...' },
  { id: 2, icon: <FaBell className="inbox-icon system" />, title: 'System Update', time: '15 min ago', excerpt: 'New Counsellor Application' },
  { id: 3, icon: <FaUser className="inbox-icon patient" />, title: 'Patient Jane Smith', time: '1 hour ago', excerpt: 'Thank you for connecting me' },
  { id: 4, icon: <FaBell className="inbox-icon system" />, title: 'System Alert', time: 'Yesterday', excerpt: 'Resource Uploaded' },
  { id: 5, icon: <img src={avatar2} alt="Dr. Lee" className="inbox-icon" />, title: 'Counsellor David Lee', time: '2 days ago', excerpt: 'Could we please reschedule my...' },
  { id: 6, icon: <FaUsers className="inbox-icon system" />, title: 'New User Registration', time: '3 days ago', excerpt: 'New patient registered' },
];
// --- End of Data ---

const AdminMessages = () => {
  const [activeMessageId, setActiveMessageId] = useState(null);

  return (
    <div className="admin-messaging-page">
      {/* Remove default page padding by overriding parent style */}
      <style>{`.admin-page-content { padding: 0 !important; }`}</style>

      <div className="admin-messaging-layout">
        
        {/* --- Inbox Panel --- */}
        <div className="inbox-panel">
          <div className="inbox-header">
            <h2>Inbox</h2>
            <button className="admin-btn-primary" style={{ padding: '8px 12px' }}>
              <FaPaperPlane /> Send Announcement
            </button>
          </div>
          <div className="inbox-list">
            {inboxData.map(item => (
              <div 
                key={item.id} 
                className={`inbox-item ${activeMessageId === item.id ? 'active' : ''}`}
                onClick={() => setActiveMessageId(item.id)}
              >
                <div className="inbox-icon-wrapper">{item.icon}</div>
                <div className="inbox-content">
                  <div className="inbox-title">
                    <h3>{item.title}</h3>
                    <span className="inbox-time">{item.time}</span>
                  </div>
                  <p className="inbox-excerpt">{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Message View Panel --- */}
        <div className="message-view">
          {/* We will just show the welcome message as per the design. 
              Clicking a message would swap this view. */}
          <div className="message-view-welcome">
            <FaComments />
            <h2>Welcome to Messaging & Notifications</h2>
            <p>
              Review messages from counsellors and patients, 
              and stay updated with system notifications.
            </p>
            <button className="admin-btn-primary">View All Messages</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminMessages;