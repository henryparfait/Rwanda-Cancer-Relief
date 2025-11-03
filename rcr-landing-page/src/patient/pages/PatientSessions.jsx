// src/patient/pages/PatientSessions.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import avatar1 from '../../assets/avatars/avatar4.png'; // Placeholder
import avatar2 from '../../assets/avatars/avatar2.png'; // Placeholder

// --- Placeholder Data ---
const upcomingSessions = [
  { id: 1, name: 'Dr. Aline Mugisha', date: 'October 28, 2024', time: '10:30 AM' },
  { id: 2, name: 'Mr. Jean-Luc Kwizera', date: 'November 01, 2024', time: '02:00 PM' },
  { id: 3, name: 'Ms. Chantal Uwimana', date: 'November 08, 2024', time: '02:00 PM' },
];
// --- End of Data ---

const PatientSessions = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);

  return (
    <div className="session-page-layout">
      
      {/* --- Main Booking Area (Left Column) --- */}
      <div className="session-booking-main">
        <div className="patient-page-header">
          <h1>Book a New Session</h1>
        </div>

        {/* --- Calendar Section --- */}
        <section className="booking-section">
          <h3>Select a Date</h3>
          <div className="calendar-placeholder">
            <div className="calendar-header">
              <button>&lt;</button>
              <span>October 2025</span>
              <button>&gt;</button>
            </div>
            <div className="calendar-grid">
              {/* Headers */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="calendar-day header">{d}</div>)}
              {/* Dates (example) */}
              <div className="calendar-day number disabled">28</div>
              <div className="calendar-day number disabled">29</div>
              <div className="calendar-day number disabled">30</div>
              <div className="calendar-day number">1</div>
              <div className="calendar-day number">2</div>
              <div className="calendar-day number">3</div>
              <div className="calendar-day number">4</div>
              <div className="calendar-day number">5</div>
              <div className="calendar-day number active">6</div>
              {/* ... fill more days as needed */}
            </div>
          </div>
        </section>

        {/* --- Counsellor Selection --- */}
        <section className="booking-section">
          <h3>Choose Counsellor & Time</h3>
          <div className="counsellor-select-grid">
            {/* Example Counsellor Cards */}
            <div 
              className={`counsellor-select-card ${selectedCounsellor === 1 ? 'active' : ''}`}
              onClick={() => setSelectedCounsellor(1)}
            >
              <img src={avatar1} alt="Aline Mugisha" />
              <h4>Dr. Aline Mugisha</h4>
              <p>Oncology Support</p>
            </div>
            <div 
              className={`counsellor-select-card ${selectedCounsellor === 2 ? 'active' : ''}`}
              onClick={() => setSelectedCounsellor(2)}
            >
              <img src={avatar2} alt="Jean-Luc Kwizera" />
              <h4>Mr. Jean-Luc Kwizera</h4>
              <p>Grief & Loss</p>
            </div>
          </div>
        </section>

        {/* --- Time Slot & Booking Button --- */}
        <section className="booking-section">
          <h3>Available Time Slots:</h3>
          <div className="time-slot-placeholder">
            Select a date and counsellor to see available times
          </div>
          <button className="book-session-btn" disabled={!selectedCounsellor} style={{ marginTop: '15px' }}>
            Book Session
          </button>
        </section>
      </div>

      {/* --- Upcoming Sessions (Right Column) --- */}
      <aside className="upcoming-sessions-sidebar">
        <h2>My Upcoming Sessions</h2>
        {upcomingSessions.map(session => (
          <div className="upcoming-session-item" key={session.id}>
            <div className="session-item-avatar">{session.name.charAt(0)}</div>
            <div className="session-item-info">
              <h4>{session.name}</h4>
              <p>{session.date} - {session.time}</p>
            </div>
            <Link to="#" className="session-item-details-btn">Details</Link>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default PatientSessions;