// src/dashboard/pages/SessionManagement.jsx
import React, { useState } from 'react';
import './DashboardPages.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';

const upcomingSessionsData = [
  {
    avatar: avatar1,
    name: 'Amina Kassim',
    status: 'Scheduled',
    statusColor: 'green',
    date: 'Today, October 28, 2024',
    time: '10:00 AM - 11:00 AM',
  },
  {
    avatar: avatar2,
    name: 'Jean-Pierre Mugisha',
    status: 'Scheduled',
    statusColor: 'green',
    date: 'Tomorrow, October 29, 2024',
    time: '02:00 PM - 03:00 PM',
  },
  {
    avatar: avatar3,
    name: 'Mukamana Uwimana',
    status: 'Scheduled',
    statusColor: 'green',
    date: 'Monday, October 30, 2024',
    time: '09:30 AM - 10:30 AM',
  },
];

const pastSessionsData = [
  {
    avatar: avatar2,
    name: 'Kofi Mensah',
    status: 'Completed',
    statusColor: 'blue',
    date: 'Tuesday, October 24, 2024',
    time: '11:00 AM - 12:00 PM',
  },
  {
    avatar: avatar3,
    name: 'Sarah Ndikumana',
    status: 'Completed',
    statusColor: 'blue',
    date: 'Monday, October 23, 2024',
    time: '01:00 PM - 02:00 PM',
  },
];
// --- End of Data ---


const SessionManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  return (
    <div className="session-management-page">
      {/* --- Page Header --- */}
      <div className="page-header">
        <h1>Session Management</h1>
      </div>

      {/* --- Session Tabs --- */}
      <div className="session-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Sessions
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Sessions
        </button>
      </div>

      {/* --- Session Grid --- */}
      <div className="session-grid">
        {(activeTab === 'upcoming' ? upcomingSessionsData : pastSessionsData).map((session, index) => (
          <div className="session-card" key={index}>
            <div className="session-patient-info">
              <img src={session.avatar} alt={session.name} className="session-avatar" />
              <div className="session-patient-details">
                <span className="session-patient-name">{session.name}</span>
                <span className={`session-status-badge ${session.statusColor}`}>
                  {session.status}
                </span>
              </div>
            </div>
            <div className="session-time-info">
              <div>
                <FaCalendarAlt />
                <span>{session.date}</span>
              </div>
              <div>
                <FaClock />
                <span>{session.time}</span>
              </div>
            </div>
            <div className="session-actions">
              {activeTab === 'upcoming' ? (
                <>
                  <button className="btn btn-primary-solid">Start Session</button>
                  <button className="btn btn-secondary-outline">Reschedule</button>
                </>
              ) : (
                <button className="btn btn-secondary-outline">View Notes</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManagement;