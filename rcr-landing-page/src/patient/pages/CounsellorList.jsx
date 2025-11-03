// src/patient/pages/CounsellorList.jsx
import React from 'react';
import './PatientDashboard.css';
import { FaSearch, FaFilter, FaCommentDots, FaVideo } from 'react-icons/fa';
import avatar1 from '../../assets/avatars/avatar4.png'; // Placeholder
import avatar2 from '../../assets/avatars/avatar2.png'; // Placeholder
import avatar3 from '../../assets/avatars/avatar3.png'; // Placeholder

// --- Placeholder Data ---
const counsellorsData = [
  { id: 1, avatar: avatar1, name: 'Dr. Anya Sharma', specialty: 'Oncology & Grief Support' },
  { id: 2, avatar: avatar2, name: 'Mr. David Chen', specialty: 'Stress & Anxiety Management' },
  { id: 3, avatar: avatar3, name: 'Ms. Sarah Kimani', specialty: 'Family & Caregiver Support' },
  { id: 4, avatar: avatar3, name: 'Ms. Emily Watson', specialty: 'Post-Treatment Recovery' },
  { id: 5, avatar: avatar1, name: 'Mr. Samuel Omondi', specialty: 'Navigating Diagnosis & Treatment' },
  { id: 6, avatar: avatar2, name: 'Dr. Olivia Rodriguez', specialty: 'Pediatric Oncology' },
];
// --- End of Data ---

const CounsellorList = () => {
  return (
    <div className="counsellor-list-page">
      {/* --- Page Header --- */}
      <div className="patient-page-header">
        <h1>Counsellors</h1>
        <p>Connect with our compassionate and experienced counsellors for personalized support.</p>
      </div>

      {/* --- Filter Controls --- */}
      <div className="counsellor-controls">
        <div className="counsellor-search">
          <FaSearch />
          <input type="text" placeholder="Search counsellors by name or specialization..." />
        </div>
        <button className="filter-btn">
          <FaFilter />
          <span>Filter</span>
        </button>
      </div>

      {/* --- Counsellor Grid --- */}
      <div className="counsellor-grid">
        {counsellorsData.map(counsellor => (
          <div className="counsellor-card" key={counsellor.id}>
            <img src={counsellor.avatar} alt={counsellor.name} className="counsellor-avatar" />
            <h3>{counsellor.name}</h3>
            <p>{counsellor.specialty}</p>
            <div className="counsellor-card-actions">
              <button className="btn btn-main">Book Session</button>
              <button className="btn btn-icon" title="Send Message">
                <FaCommentDots />
              </button>
              <button className="btn btn-icon" title="Start Video Call">
                <FaVideo />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorList;