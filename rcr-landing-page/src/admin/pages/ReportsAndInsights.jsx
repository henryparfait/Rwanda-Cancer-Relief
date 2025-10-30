// src/admin/pages/ReportsAndInsights.jsx
import React from 'react';
import './AdminDashboard.css';
import { FaDownload, FaFileCsv } from 'react-icons/fa';

// --- Placeholder Data ---
const counsellorActivityData = [
  { id: 1, name: 'Dr. Jane Doe', sessions: 85, avgRating: '4.9/5', feedback: 'Excellent' },
  { id: 2, name: 'Mr. John Smith', sessions: 72, avgRating: '4.7/5', feedback: 'Very Good' },
  { id: 3, name: 'Ms. Emily White', sessions: 68, avgRating: '4.8/5', feedback: 'Good' },
  { id: 4, name: 'Dr. David Green', sessions: 50, avgRating: '4.6/5', feedback: 'Satisfactory' },
  { id: 5, name: 'Mrs. Sarah Brown', sessions: 45, avgRating: '4.7/5', feedback: 'Good' },
];

const patientEngagementData = [
  { id: 'RCR-P001', sessions: 12, lastSession: '2024-05-28', resources: 5 },
  { id: 'RCR-P002', sessions: 8, lastSession: '2024-05-25', resources: 3 },
  { id: 'RCR-P003', sessions: 15, lastSession: '2024-05-30', resources: 7 },
  { id: 'RCR-P004', sessions: 5, lastSession: '2024-05-20', resources: 2 },
  { id: 'RCR-P005', sessions: 10, lastSession: '2024-05-29', resources: 4 },
];
// --- End of Data ---

const ReportsAndInsights = () => {
  return (
    <div className="reports-page">
      {/* --- Page Header --- */}
      <div className="reports-header">
        <div className="admin-page-header" style={{ marginBottom: 0 }}>
          <h1>Reports & Insights</h1>
        </div>
        <div className="reports-header-actions">
          <button className="admin-btn-outline"><FaDownload /> Download PDF</button>
          <button className="admin-btn-outline"><FaFileCsv /> Export CSV</button>
        </div>
      </div>

      {/* --- Overall Performance Stats --- */}
      <div className="report-stats-grid">
        <StatCard label="Total Sessions" number="1,245" comparison="+5% from last month" />
        <StatCard label="Average Session Duration" number="45 min" comparison="-2% from last month" isNegative />
        <StatCard label="Active Counsellors" number="28" comparison="+1 new this month" />
        <StatCard label="New Patients Registered" number="110" comparison="+15 from last month" />
      </div>

      {/* --- Weekly Session Overview --- */}
      <div className="report-section">
        <div className="report-section-header">
          <h3>Weekly Session Overview</h3>
        </div>
        
        {/* We'll use a simple table for now, matching your design */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Total Sessions</th>
              <th>Completed</th>
              <th>Cancelled</th>
              <th>Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>2024-W23</td><td>120</td><td>115</td><td>5</td><td>4.8/5</td></tr>
            <tr><td>2024-W22</td><td>110</td><td>105</td><td>5</td><td>4.7/5</td></tr>
            <tr><td>2024-W21</td><td>130</td><td>128</td><td>2</td><td>4.9/5</td></tr>
            <tr><td>2024-W20</td><td>95</td><td>90</td><td>5</td><td>4.6/5</td></tr>
            <tr><td>2024-W19</td><td>105</td><td>100</td><td>5</td><td>4.7/5</td></tr>
          </tbody>
        </table>
      </div>
      
      {/* --- Counsellor Activity --- */}
      <div className="report-section">
        <div className="report-section-header">
          <h3>Counsellor Activity</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Counsellor Name</th>
              <th>Sessions Completed</th>
              <th>Avg. Rating</th>
              <th>Patient Feedback Score</th>
            </tr>
          </thead>
          <tbody>
            {counsellorActivityData.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.sessions}</td>
                <td>{c.avgRating}</td>
                <td>{c.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- Patient Engagement --- */}
      <div className="report-section">
        <div className="report-section-header">
          <h3>Patient Engagement</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Total Sessions</th>
              <th>Last Session Date</th>
              <th>Resources Accessed</th>
            </tr>
          </thead>
          <tbody>
            {patientEngagementData.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.sessions}</td>
                <td>{p.lastSession}</td>
                <td>{p.resources}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// Helper component for the stat cards
const StatCard = ({ label, number, comparison, isNegative = false }) => (
  <div className="report-stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-number">{number}</div>
    <div className={`stat-comparison ${isNegative ? 'negative' : ''}`}>
      {comparison}
    </div>
  </div>
);

export default ReportsAndInsights;