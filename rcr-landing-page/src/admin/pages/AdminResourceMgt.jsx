// src/admin/pages/AdminResourceMgt.jsx
import React, { useState } from 'react';
import './AdminDashboard.css';
import '../../pages/AuthForm.css'; // Re-use for form styling
import { FaPlus, FaTimes } from 'react-icons/fa';

// --- Placeholder Data ---
import thumb1 from '../../assets/resource-thumb-1.png';
import thumb2 from '../../assets/resource-thumb-2.png';
import thumb3 from '../../assets/resource-thumb-3.png';
import thumb4 from '../../assets/resource-thumb-4.png';

const resourceData = [
  { id: 1, title: 'Comprehensive Cancer Handbook', uploader: 'Admin: Jane Doe', type: 'PDF', date: '2023-10-26', isFeatured: true, thumb: thumb1 },
  { id: 2, title: 'Understanding Chemotherapy', uploader: 'Counsellor: Alice Smith', type: 'Video', date: '2023-10-24', isFeatured: false, thumb: thumb2 },
  { id: 3, title: 'Nutrition for Cancer Patients', uploader: 'Admin: Alice Brown', type: 'Guide', date: '2023-10-24', isFeatured: true, thumb: thumb3 },
  { id: 4, title: 'Support Group Testimonials', uploader: 'Counsellor: Emily White', type: 'Video', date: '2023-10-23', isFeatured: false, thumb: thumb4 },
];
// --- End of Data ---

// --- Upload Modal Component ---
const UploadResourceModal = ({ closeModal }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Upload New Resource</h2>
        <button onClick={closeModal} className="modal-close-btn"><FaTimes /></button>
      </div>
      <form className="modal-body">
        <div className="form-group">
          <label htmlFor="resourceName">Resource Name</label>
          <input type="text" id="resourceName" placeholder="e.g., Comprehensive Cancer Guide" />
        </div>
        <div className="form-group">
          <label htmlFor="resourceType">Resource Type</label>
          <select id="resourceType">
            <option value="">Select type</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="guide">Guide</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" placeholder="Briefly describe the resource content."></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="uploadFile">Upload File</label>
          <input type="file" id="uploadFile" />
        </div>
        <div className="modal-footer">
          <button type="button" onClick={closeModal} className="admin-btn-secondary">Cancel</button>
          <button type="submit" className="admin-btn-primary">Upload</button>
        </div>
      </form>
    </div>
  </div>
);

// --- Main Page Component ---
const AdminResourceMgt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="admin-resource-page">
      {isModalOpen && <UploadResourceModal closeModal={() => setIsModalOpen(false)} />}

      <div className="admin-page-controls" style={{ justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Resource Management</h1>
        <button className="admin-btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Upload New Resource
        </button>
      </div>

      <div className="admin-resource-grid">
        {resourceData.map(res => (
          <div className="admin-resource-card" key={res.id}>
            <div className="admin-resource-thumbnail">
              <img src={res.thumb} alt={res.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {res.isFeatured && <span className="featured-badge">Featured</span>}
            </div>
            <div className="admin-resource-content">
              <h3>{res.title}</h3>
              <div className="resource-meta-info">
                <span>Uploaded by: {res.uploader}</span>
                <span>Type: {res.type} | Uploaded on: {res.date}</span>
              </div>
              <div className="admin-resource-actions">
                <button className="admin-btn-outline">View</button>
                <button className="admin-btn-outline delete">Delete</button>
                <button className="admin-btn-outline feature">
                  {res.isFeatured ? 'Unfeature' : 'Feature'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminResourceMgt;