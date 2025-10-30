// src/dashboard/pages/ResourceLibrary.jsx
import React from 'react';
import './DashboardPages.css';
import { 
  FaFilePdf, FaVideo, FaBookOpen, FaLink, 
  FaFilter, FaSortAmountDown, FaUpload 
} from 'react-icons/fa';

// --- Placeholder Data ---
// You'll need to add placeholder images to 'src/assets/'
import thumb1 from '../../assets/resource-thumb-1.png';
import thumb2 from '../../assets/resource-thumb-2.png';
import thumb3 from '../../assets/resource-thumb-3.png';
import thumb4 from '../../assets/resource-thumb-4.png';

const resourceData = [
  {
    type: 'pdf',
    icon: <FaFilePdf />,
    tag: 'PDF',
    thumbnail: thumb1,
    title: 'Counselling Techniques for Anxiety',
    description: 'A comprehensive guide on cognitive behavioral therapy techniques.'
  },
  {
    type: 'video',
    icon: <FaVideo />,
    tag: 'Video',
    thumbnail: thumb2,
    title: 'Understanding Grief and Loss',
    description: 'An educational video explaining the stages of grief and how to...'
  },
  {
    type: 'guide',
    icon: <FaBookOpen />,
    tag: 'Guide',
    thumbnail: thumb3,
    title: 'Patient Communication Best Practices',
    description: 'A short guide on effective communication strategies to...'
  },
  {
    type: 'link',
    icon: <FaLink />,
    tag: 'Link',
    thumbnail: thumb4,
    title: 'Mindfulness Meditation Audio',
    description: 'A series of guided audio meditations to help patients and...'
  },
  {
    type: 'pdf',
    icon: <FaFilePdf />,
    tag: 'PDF',
    thumbnail: thumb1,
    title: 'Diet and Cancer Prevention',
    description: 'Information sheet on nutritional guidelines and dietary advice for...'
  },
  {
    type: 'video',
    icon: <FaVideo />,
    tag: 'Video',
    thumbnail: thumb2,
    title: 'Supporting Families of Cancer Patients',
    description: 'Video seminar on techniques and resources for supporting the...'
  },
];
// --- End of Data ---

const ResourceCard = ({ resource }) => (
  <div className="resource-card">
    <img src={resource.thumbnail} alt={resource.title} className="resource-thumbnail" />
    <div className="resource-content">
      <span className={`resource-tag ${resource.type}`}>
        {resource.icon}
        {resource.tag}
      </span>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <button className="btn btn-primary-solid" style={{ width: '100%' }}>Download</button>
    </div>
  </div>
);

const ResourceLibrary = () => {
  return (
    <div className="resource-library-page">
      {/* --- Page Header --- */}
      <div className="resource-header">
        <h1>Resource Library</h1>
        <button className="btn btn-primary-solid" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUpload />
          Upload Resource
        </button>
      </div>

      {/* --- Filter/Sort Controls --- */}
      <div className="resource-controls">
        <div className="filter-group">
          <FaFilter />
          <label htmlFor="filter-type">Filter by:</label>
          <select id="filter-type">
            <option value="all">Resource Type</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="guide">Guide</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div className="filter-group">
          <FaSortAmountDown />
          <label htmlFor="sort-by">Sort by:</label>
          <select id="sort-by">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* --- Resource Grid --- */}
      <div className="resource-grid">
        {resourceData.map((resource, index) => (
          <ResourceCard key={index} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;