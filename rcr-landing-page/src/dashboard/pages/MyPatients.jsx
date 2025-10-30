// src/dashboard/pages/MyPatients.jsx
import React from 'react';
import './DashboardPages.css'; // Import the shared CSS
import { FaCalendarCheck } from 'react-icons/fa';

// --- Placeholder Data ---
// You'll need to add your avatar images to 'src/assets/avatars/'
import avatar1 from '../../assets/avatars/avatar4.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';

const patientsData = [
  {
    avatar: avatar1,
    name: 'Amina Hassan',
    focus: 'Breast Cancer Support',
    lastSession: '2024-07-20',
  },
  {
    avatar: avatar2,
    name: 'Jean-Pierre Nsanzimana',
    focus: 'Leukemia Emotional Support',
    lastSession: '2024-07-18',
  },
  {
    avatar: avatar3,
    name: 'Umuhoza Keza',
    focus: 'Post-Treatment Recovery',
    lastSession: '2024-07-15',
  },
  {
    avatar: avatar1,
    name: 'Kwame Nkrumah',
    focus: 'Prostate Cancer Counseling',
    lastSession: '2024-07-12',
  },
  {
    avatar: avatar2,
    name: 'Nadia Uwase',
    focus: 'Pediatric Oncology Support',
    lastSession: '2024-07-10',
  },
  {
    avatar: avatar3,
    name: 'David Mugisha',
    focus: 'Grief Counseling',
    lastSession: '2024-07-08',
  },
];
// --- End of Data ---


const MyPatients = () => {
  return (
    <div className="my-patients-page">
      {/* --- Page Header --- */}
      <div className="page-header">
        <h1>My Patients</h1>
        <p>Manage and connect with all your assigned patients, view their details, and initiate communication.</p>
      </div>

      {/* --- Patient Grid --- */}
      <div className="patient-grid">
        {patientsData.map((patient, index) => (
          <div className="patient-card" key={index}>
            <img src={patient.avatar} alt={patient.name} className="patient-avatar" />
            <h3 className="patient-name">{patient.name}</h3>
            <p className="patient-focus">{patient.focus}</p>
            <div className="patient-last-session">
              <FaCalendarCheck />
              <span>Last Session: {patient.lastSession}</span>
            </div>
            <div className="patient-actions">
              <button className="btn btn-primary-solid">View Profile</button>
              <button className="btn btn-secondary-text">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPatients;