// src/admin/pages/UserManagement.jsx
import React, { useState } from 'react';
import './AdminDashboard.css';
import { FaSearch, FaPlus, FaPen, FaTrash, FaEye } from 'react-icons/fa';

// --- Placeholder Data ---
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';

const patientData = [
  { id: 1, avatar: avatar1, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Patient', status: 'active' },
  { id: 2, avatar: avatar2, name: 'Bob Smith', email: 'bob.s@example.com', role: 'Patient', status: 'active' },
  { id: 3, avatar: avatar3, name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Patient', status: 'inactive' },
  { id: 4, avatar: avatar2, name: 'Diana Prince', email: 'diana.p@example.com', role: 'Patient', status: 'pending' },
];
const counsellorData = [
  { id: 1, avatar: avatar3, name: 'Dr. Evelyn Mutua', email: 'e.mutua@rcr.org', role: 'Counsellor', status: 'active' },
  { id: 2, avatar: avatar1, name: 'Dr. David Kwizera', email: 'd.kwizera@rcr.org', role: 'Counsellor', status: 'active' },
];
const adminData = [
  { id: 1, avatar: avatar2, name: 'Admin User', email: 'admin@rcr.org', role: 'Admin', status: 'active' },
];
// --- End of Data ---

const UserTable = ({ users }) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email/Contact</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <div className="table-user-info">
                <img src={user.avatar} alt={user.name} className="table-user-avatar" />
                {user.name}
              </div>
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <span className={`status-badge ${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </td>
            <td>
              <div className="table-actions">
                <button title="Edit"><FaPen /></button>
                <button title="View Details"><FaEye /></button>
                <button title="Delete" className="delete"><FaTrash /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('patients');

  const renderTable = () => {
    switch (activeTab) {
      case 'patients':
        return <UserTable users={patientData} />;
      case 'counsellors':
        return <UserTable users={counsellorData} />;
      case 'admins':
        return <UserTable users={adminData} />;
      default:
        return null;
    }
  };

  return (
    <div className="user-management-page">
      <div className="admin-page-header">
        <h1>User Management</h1>
      </div>

      <div className="admin-page-controls">
        <div className="admin-search-bar">
          <FaSearch />
          <input type="text" placeholder="Search by name or email..." />
        </div>
        <button className="admin-btn-primary">
          <FaPlus /> Add New User
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab-button ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Patients ({patientData.length})
        </button>
        <button
          className={`admin-tab-button ${activeTab === 'counsellors' ? 'active' : ''}`}
          onClick={() => setActiveTab('counsellors')}
        >
          Counsellors ({counsellorData.length})
        </button>
        <button
          className={`admin-tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admins ({adminData.length})
        </button>
      </div>

      <div className="admin-table-container">
        {renderTable()}
      </div>
      
      <div className="table-pagination">
        <span>Page 1 of 3</span>
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default UserManagement;