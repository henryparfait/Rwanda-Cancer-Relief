// src/patient/pages/Community.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import { 
  FaPlus, FaEllipsisH, FaHeart, FaCommentAlt, 
  FaShare, FaChartLine, FaBookOpen, FaBook, FaCalendarAlt
} from 'react-icons/fa';
import apiClient from '../../services/apiClient';

const formatDateTime = (value) => {
  if (!value) {
    return 'Just now';
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiClient.get('/community', {
          params: { audience: 'patients', limit: 20 }
        });

        if (!isMounted) {
          return;
        }

        setPosts(result || []);
        setIsAuthenticated(true);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status === 401) {
          setIsAuthenticated(false);
          setError('Sign in to join the community conversations.');
        } else {
          setError(fetchError.message || 'Unable to load community posts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const trendingTags = useMemo(() => {
    const tagCounts = new Map();
    posts.forEach((post) => {
      (post.tags || []).forEach((tag) => {
        const normalised = tag.toLowerCase();
        tagCounts.set(normalised, (tagCounts.get(normalised) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  return (
    <div className="community-page-layout">
      {/* --- Main Feed (Left) --- */}
      <div className="community-feed">
        <div className="ask-question-bar">
          <div className="ask-question-avatar">?</div>
          <input type="text" placeholder="Ask a question or share an experience..." disabled />
          <button type="button" disabled><FaPlus /></button>
        </div>

        {loading && (
          <div className="qa-post loading-post">
            <div className="post-body">
              <h3>Loading discussions…</h3>
              <p>We are bringing the latest community updates to you.</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="qa-post error-post">
            <div className="post-body">
              <h3>{error}</h3>
              {!isAuthenticated && <p>Authenticate to contribute to the community.</p>}
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="qa-post empty-post">
            <div className="post-body">
              <h3>No discussions yet</h3>
              <p>Start the first conversation to support fellow patients.</p>
            </div>
          </div>
        )}

        {!loading && !error && posts.map((post) => (
          <div className="qa-post" key={post.id}>
            <div className="post-header">
              <div className="post-author">
                <div className="post-author-avatar">
                  {post.author?.profile?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="post-author-info">
                  <h4>{post.author?.profile?.firstName ? `${post.author.profile.firstName} ${post.author.profile.lastName || ''}`.trim() : 'Community Member'}</h4>
                  <p>{formatDateTime(post.publishedAt || post.createdAt)}</p>
                </div>
              </div>
              <button className="post-options" type="button"><FaEllipsisH /></button>
            </div>
            <div className="post-body">
              {post.title && <h3>{post.title}</h3>}
              <p>{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="post-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="post-footer">
              <span className="post-action"><FaHeart /> {post.reactionSummary?.support + post.reactionSummary?.celebrate + post.reactionSummary?.like + post.reactionSummary?.insight || 0}</span>
              <span className="post-action"><FaCommentAlt /> {post.commentCount || 0}</span>
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
            {trendingTags.length === 0 && (
              <div className="trending-item">
                <FaChartLine className="trending-icon" />
                <div className="trending-item-info">
                  <h4>Community stories</h4>
                  <p>Join the conversation</p>
                </div>
              </div>
            )}

            {trendingTags.map((topic) => (
              <div className="trending-item" key={topic.tag}>
                <FaChartLine className="trending-icon" />
                <div className="trending-item-info">
                  <h4>#{topic.tag}</h4>
                  <p>{topic.count} mentions</p>
                </div>
              </div>
            ))}
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