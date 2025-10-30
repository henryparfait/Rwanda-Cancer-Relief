// src/admin/pages/ApprovalCenter.jsx
import React from 'react';
import './AdminDashboard.css';

// --- Placeholder Data ---
const counsellorApplications = [
  { id: 1, name: 'Dr. Aline Uwimana', specialization: 'Oncology, Pediatric Counselling', date: '2023-10-26' },
  { id: 2, name: 'Mr. Jean-Luc Nsengimana', specialization: 'Palliative Care, Family Support', date: '2023-11-10' },
  { id: 3, name: 'Ms. Chantal Mukamana', specialization: 'Nutritional Support, Mental Health', date: '2023-11-15' },
  { id: 4, name: 'Dr. David Gahigi', specialization: 'Post-Treatment Recovery, Group Therapy', date: '2023-11-20' },
];

const contentSubmissions = [
  { id: 1, tag: 'Resource Guide', tagClass: 'guide', title: 'Understanding Chemotherapy Side Effects', date: '2023-11-28', description: 'A comprehensive guide for patients and caregivers on managing common side effects.' },
  { id: 2, tag: 'Article', tagClass: 'article', title: 'Local Support Groups for Cancer Patients in Kigali', date: '2023-12-01', description: 'An article listing various local support groups, their meeting times, locations, and contact...' },
  { id: 3, tag: 'Recipe Book', tagClass: 'recipe', title: 'Healthy Eating During Cancer Treatment: A Recipe Book', date: '2023-12-05', description: 'A collection of easy-to-prepare, nutritious recipes designed for cancer patients, focusing on...' },
];
// --- End of Data ---


const ApprovalCenter = () => {
  return (
    <div className="approval-center-page">
      <div className="admin-page-header">
        <h1>Approval Center</h1>
      </div>

      {/* --- Counsellor Applications Section --- */}
      <section className="approval-section">
        <h2>Pending Counsellor Applications</h2>
        <div className="approval-grid">
          {counsellorApplications.map(app => (
            <div className="approval-card" key={app.id}>
              <div className="approval-card-header">
                <h3>{app.name}</h3>
                <p>Counsellor Application</p>
              </div>
              <div className="approval-card-info">
                <strong>Specialization:</strong> {app.specialization}<br />
                <strong>Application Date:</strong> {app.date}
              </div>
              <div className="approval-actions">
                <button className="admin-btn-approve">Approve</button>
                <button className="admin-btn-reject">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Content Review Section --- */}
      <section className="approval-section">
        <h2>Content Requiring Review</h2>
        <div className="approval-grid">
          {contentSubmissions.map(content => (
            <div className="approval-card" key={content.id}>
              <div className="approval-card-header">
                <span className={`content-card-tag ${content.tagClass}`}>{content.tag}</span>
                <h3>{content.title}</h3>
              </div>
              <div className="approval-card-info">
                <p>{content.description}</p>
                <strong>Submission Date:</strong> {content.date}
              </div>
              <div className="approval-actions">
                <button className="admin-btn-approve">Approve</button>
                <button className="admin-btn-reject">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApprovalCenter;