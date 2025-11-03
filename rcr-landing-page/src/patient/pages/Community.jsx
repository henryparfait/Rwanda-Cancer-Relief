// src/patient/pages/Community.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import { 
  FaPlus, FaEllipsisH, FaHeart, FaCommentAlt, 
  FaShare, FaChartLine, FaBookOpen, FaBook, FaCalendarAlt
} from 'react-icons/fa';
import userAvatar from '../../assets/avatars/avatar4.png'; // Placeholder for the user

// --- Placeholder Data ---
const qaPosts = [
  {
    id: 1,
    author: 'Anonymous User',
    time: '5 hours ago',
    title: 'Coping with hair loss during chemotherapy',
    body: 'I\'m really struggling with the emotional impact of hair loss. Does anyone have tips for dealing with this?',
    likes: 15,
    comments: 7
  },
  {
    id: 2,
    author: 'Anonymous User',
    time: '1 day ago',
    title: 'Best ways to explain my diagnosis to young children',
    body: 'My kids are asking a lot of questions about my cancer diagnosis. How can I explain it to them in a way they understand without scaring them?',
    likes: 22,
    comments: 12
  },
  {
    id: 3,
    author: 'Anonymous User',
    time: '1 day ago',
    title: 'Finding support groups in Kigali for cancer patients',
    body: 'I\'m looking for local support groups in Kigali to connect with other cancer patients. Any recommendations or experiences to share?',
    likes: 18,
    comments: 9
  },
];
// --- End of Data ---

const Community = () => {
  return (
    <div className="community-page-layout">
      {/* --- Main Feed (Left) --- */}
      <div className="community-feed">
        <div className="ask-question-bar">
          <img src={userAvatar} alt="Your Avatar" />
          <input type="text" placeholder="Ask a question anonymously..." />
          <button><FaPlus /></button>
        </div>

        {qaPosts.map(post => (
          <div className="qa-post" key={post.id}>
            <div className="post-header">
              <div className="post-author">
                <div className="post-author-avatar">{post.author.charAt(0)}</div>
                <div className="post-author-info">
                  <h4>{post.author}</h4>
                  <p>{post.time}</p>
                </div>
              </div>
              <button className="post-options"><FaEllipsisH /></button>
            </div>
            <div className="post-body">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
            <div className="post-footer">
              <span className="post-action"><FaHeart /> {post.likes}</span>
              <span className="post-action"><FaCommentAlt /> {post.comments}</span>
              <span className="post-action"><FaShare /> Share</span>
              <Link to="#" className="post-reply-btn">Reply</Link>
            </div>
          </div>
        ))}
      </div>

      {/* --- Community Sidebar (Right) --- */}
      <aside className="community-sidebar">
        <section className="sidebar-section">
          <h3>Trending Discussions</h3>
          <div className="trending-list">
            <div className="trending-item">
              <FaChartLine className="trending-icon" />
              <div className="trending-item-info">
                <h4>Navigating financial challenges with cancer</h4>
                <p>43 participants</p>
              </div>
            </div>
            <div className="trending-item">
              <FaChartLine className="trending-icon" />
              <div className="trending-item-info">
                <h4>Mindfulness and meditation for stress</h4>
                <p>32 participants</p>
              </div>
            </div>
            <div className="trending-item">
              <FaChartLine className="trending-icon" />
              <div className="trending-item-info">
                <h4>Healthy eating during and after treatment</h4>
                <p>28 participants</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sidebar-section">
          <h3>Quick Links</h3>
          <div className="quick-links-list">
            <Link to="/patient/resources" className="quick-link-item">
              <FaBookOpen /> Counselling Modules
            </Link>
            <Link to="/patient/resources" className="quick-link-item">
              <FaBook /> Resource Library
            </Link>
            <Link to="/patient/sessions" className="quick-link-item">
              <FaCalendarAlt /> Session Scheduling
            </Link>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default Community;