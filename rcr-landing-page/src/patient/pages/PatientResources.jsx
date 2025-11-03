// src/patient/pages/PatientResources.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import { FaSearch, FaImage } from 'react-icons/fa';

// --- Placeholder Data ---
const resourcesData = [
  { id: 1, tag: 'Article', tagClass: 'article', title: 'Healthy Eating During Treatment', description: 'Practical tips for maintaining good nutrition and managing side effects like nausea and loss of appetite, improving...' },
  { id: 2, tag: 'Article', tagClass: 'article', title: 'Meal Prep for Cancer Patients', description: 'Simple and quick meal preparation ideas to ensure you get essential nutrients without added stress, making healthy...' },
  { id: 3, tag: 'Video', tagClass: 'video', title: 'Hydration and Electrolytes Guide', description: 'Understanding the importance of staying hydrated and managing electrolyte balance during...' },
  { id: 4, tag: 'Infographic', tagClass: 'infographic', title: 'Radiation Therapy Explained', description: 'A detailed guide to radiation therapy, addressing common concerns and preparation tips for patients and...' },
  { id: 5, tag: 'Video', tagClass: 'video', title: 'Pain Management Techniques', description: 'Exploring various approaches to manage cancer-related pain, including medication and alternative therapies, for...' },
  { id: 6, tag: 'Article', tagClass: 'article', title: 'Supporting Your Loved One', description: 'Guidance for family members on how to provide emotional and practical support to cancer patients through their journey.' },
];
// --- End of Data ---

const PatientResources = () => {
  return (
    <div className="patient-resource-page">
      {/* --- Page Header --- */}
      <div className="patient-page-header">
        <h1>Resource Library</h1>
      </div>

      {/* --- Search Bar --- */}
      <div className="resource-search-bar">
        <FaSearch />
        <input type="text" placeholder="Search articles, videos, and guides..." />
      </div>

      {/* --- Resource Grid --- */}
      <div className="patient-resource-grid">
        {resourcesData.map(resource => (
          <div className="patient-resource-card" key={resource.id}>
            <div className="patient-resource-thumbnail">
              <FaImage /> {/* Placeholder Icon */}
              <span className={`patient-resource-tag ${resource.tagClass}`}>
                {resource.tag}
              </span>
            </div>
            <div className="patient-resource-content">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <Link to="#" className="btn-read-more">Read More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientResources;