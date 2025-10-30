// src/admin/pages/SessionOversight.jsx
import React from 'react';
import './AdminDashboard.css';
import { FaEye, FaTrash, FaPen } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';

const sessionData = [
  { id: 1, pAvatar: avatar1, pName: 'Alice Uwimana', cAvatar: avatar2, cName: 'Dr. Evelyn Mutesi', dateTime: '12 Feb 2024, 10:00 AM', status: 'completed' },
  { id: 2, pAvatar: avatar3, pName: 'John Ndayishimiye', cAvatar: avatar1, cName: 'Mr. David Kwizera', dateTime: '14 Feb 2024, 02:30 PM', status: 'scheduled' },
  { id: 3, pAvatar: avatar2, pName: 'Sarah Ingabire', cAvatar: avatar3, cName: 'Ms. Grace Irabagiza', dateTime: '15 Feb 2024, 11:00 AM', status: 'scheduled' },
  { id: 4, pAvatar: avatar1, pName: 'Paul Gatete', cAvatar: avatar2, cName: 'Dr. Evelyn Mutesi', dateTime: '18 Feb 2024, 09:00 AM', status: 'cancelled' },
  { id: 5, pAvatar: avatar3, pName: 'Esther Mugisha', cAvatar: avatar1, cName: 'Mr. David Kwizera', dateTime: '28 Feb 2024, 03:00 PM', status: 'completed' },
];
// --- End of Data ---

const SessionOversight = () => {
  return (
    <div className="session-oversight-page">
      <div className="admin-page-header">
        <h1>All Counselling Sessions</h1>
      </div>

      {/* --- Filter Bar --- */}
      <div className="admin-filter-bar">
        <div className="filter-group">
          <label htmlFor="counsellor">Counsellor</label>
          <select id="counsellor">
            <option value="">Select Counsellor</option>
            <option value="evelyn">Dr. Evelyn Mutesi</option>
            <option value="david">Mr. David Kwizera</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="patient">Patient</label>
          <select id="patient">
            <option value="">Select Patient</option>
            <option value="alice">Alice Uwimana</option>
            <option value="john">John Ndayishimiye</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="from-date">From Date</label>
          <input type="date" id="from-date" />
        </div>
        <div className="filter-group">
          <label htmlFor="to-date">To Date</label>
          <input type="date" id="to-date" />
        </div>
        <div className="filter-actions">
          <button className="admin-btn-secondary">Clear Filters</button>
          <button className="admin-btn-primary">Apply Filters</button>
        </div>
      </div>

      {/* --- Session Table --- */}
      <div className="admin-table-container" style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Counsellor Name</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessionData.map(session => (
              <tr key={session.id}>
                <td>
                  <div className="table-user-info">
                    <img src={session.pAvatar} alt={session.pName} className="table-user-avatar" />
                    {session.pName}
                  </div>
                </td>
                <td>
                  <div className="table-user-info">
                    <img src={session.cAvatar} alt={session.cName} className="table-user-avatar" />
                    {session.cName}
                  </div>
                </td>
                <td>{session.dateTime}</td>
                <td>
                  <span className={`status-badge ${session.status.toLowerCase()}`}>
                    {session.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button title="View Session Details"><FaEye /></button>
                    <button title="Edit Session"><FaPen /></button>
                    <button title="Delete" className="delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- Pagination --- */}
      <div className="table-pagination">
        <button>Previous</button>
        <span>Page 1 of 3</span>
        <button>Next</button>
      </div>
    </div>
  );
};

export default SessionOversight;