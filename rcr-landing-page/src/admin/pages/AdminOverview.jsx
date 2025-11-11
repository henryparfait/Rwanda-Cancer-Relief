// src/admin/pages/AdminOverview.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import { FaUsers, FaChartBar, FaCheckSquare, FaBook, FaUserMd, FaUserCheck, FaCalendarCheck, FaExclamationCircle } from 'react-icons/fa';
import apiClient from '../../services/apiClient';

const formatNumber = (value) => {
  if (value === undefined || value === null) {
    return '—';
  }
  return new Intl.NumberFormat().format(value);
};

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const [systemOverview, dashboardOverview] = await Promise.all([
          apiClient.get('/admin/analytics/overview'),
          apiClient.get('/admin/dashboard/stats')
        ]);

        if (!isMounted) {
          return;
        }

        setOverview(systemOverview);
        setDashboardStats(dashboardOverview?.overview || {});
        setIsAuthenticated(true);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status === 401) {
          setIsAuthenticated(false);
          setError('You need to sign in as an administrator to view analytics.');
        } else {
          setError(fetchError.message || 'Unable to load analytics at the moment.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      id: 'patients',
      icon: <FaUserMd />,
      number: formatNumber(overview?.users?.totalPatients),
      label: 'Total Patients'
    },
    {
      id: 'counselors',
      icon: <FaUserCheck />,
      number: formatNumber(overview?.users?.totalCounselors),
      label: 'Total Counselors'
    },
    {
      id: 'sessions',
      icon: <FaCalendarCheck />,
      number: formatNumber(overview?.sessions?.activeSessions),
      label: 'Active Sessions'
    },
    {
      id: 'pending',
      icon: <FaExclamationCircle />,
      number: formatNumber(dashboardStats?.pendingApprovals ?? overview?.users?.pendingApprovals),
      label: 'Pending Approvals'
    }
  ];

  return (
    <div className="admin-overview-page">
      <div className="admin-page-header">
        <h1>Welcome back, Admin.</h1>
      </div>

      <h3 className="page-title" style={{ fontSize: '20px' }}>Key Statistics</h3>
      <div className="stats-grid">
        {loading && (
          <div className="stat-card loading-card">
            <div className="stat-card-info">
              <div className="stat-number">Loading…</div>
              <div className="stat-label">Fetching analytics</div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="stat-card error-card">
            <div className="stat-card-info">
              <div className="stat-number">⚠️</div>
              <div className="stat-label">{error}</div>
            </div>
          </div>
        )}

        {!loading && !error && statCards.map((card) => (
          <StatCard key={card.id} icon={card.icon} number={card.number} label={card.label} />
        ))}
      </div>

      <h3 className="page-title" style={{ fontSize: '20px' }}>Quick Actions</h3>
      <div className="admin-quick-actions">
        <Link to="/admin/users" className="admin-action-card">
          <FaUsers className="admin-action-icon" />
          <h3>Manage Users</h3>
        </Link>
        <Link to="/admin/reports" className="admin-action-card">
          <FaChartBar className="admin-action-icon" />
          <h3>View Reports</h3>
        </Link>
        <Link to="/admin/approval" className="admin-action-card">
          <FaCheckSquare className="admin-action-icon" />
          <h3>Approve Counsellors</h3>
        </Link>
        <Link to="/admin/resources" className="admin-action-card">
          <FaBook className="admin-action-icon" />
          <h3>Manage Resources</h3>
        </Link>
      </div>
    </div>
  );
};

// A helper component for the stat cards
const StatCard = ({ icon, number, label }) => (
  <div className="stat-card">
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-info">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default AdminOverview;