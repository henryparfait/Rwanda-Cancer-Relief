// src/dashboard/pages/SessionManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './DashboardPages.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import apiClient from '../../services/apiClient';

const SessionManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState({
    upcoming: [],
    past: [],
    pendingRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiClient.get('/sessions');

        if (!isMounted) {
          return;
        }

        setSessions({
          upcoming: result?.upcoming || [],
          past: result?.past || [],
          pendingRequests: result?.pendingRequests || []
        });
        setIsAuthenticated(true);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status === 401) {
          setIsAuthenticated(false);
          setError('Please sign in as a counselor to manage sessions.');
        } else {
          setError(fetchError.message || 'Unable to fetch sessions.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  const sessionData = useMemo(() => {
    if (activeTab === 'past') {
      return sessions.past;
    }
    if (activeTab === 'requests') {
      return sessions.pendingRequests;
    }
    return sessions.upcoming;
  }, [activeTab, sessions]);

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(value));
    } catch (err) {
      return value;
    }
  };

  const formatTimeRange = (value, duration) => {
    if (!value) {
      return '—';
    }

    const [hours, minutes] = value.split(':').map((segment) => Number(segment));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return value;
    }

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + (duration || 60));

    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric'
    });

    return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'requested':
        return 'yellow';
      case 'scheduled':
      case 'in-progress':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPatientName = (session) => {
    const profile = session?.patient?.profile;
    if (profile) {
      const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      if (fullName) {
        return fullName;
      }
    }
    return session?.patient?.email || 'Patient';
  };

  return (
    <div className="session-management-page">
      {/* --- Page Header --- */}
      <div className="page-header">
        <h1>Session Management</h1>
      </div>

      {/* --- Session Tabs --- */}
      <div className="session-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Sessions
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Sessions
        </button>
        <button
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Pending Requests
        </button>
      </div>

      {/* --- Session Grid --- */}
      <div className="session-grid">
        {loading && (
          <div className="session-card loading-card">
            <div className="session-patient-details">
              <span className="session-patient-name">Loading sessions…</span>
              <span className="session-status-badge gray">Please wait</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="session-card error-card">
            <div className="session-patient-details">
              <span className="session-patient-name">{error}</span>
              {!isAuthenticated && (
                <span className="session-status-badge red">Authorization required</span>
              )}
            </div>
          </div>
        )}

        {!loading && !error && sessionData.length === 0 && (
          <div className="session-card empty-card">
            <div className="session-patient-details">
              <span className="session-patient-name">No sessions to show</span>
              <span className="session-status-badge gray">
                Data will appear once sessions are scheduled
              </span>
            </div>
          </div>
        )}

        {!loading && !error && sessionData.map((session) => (
          <div className="session-card" key={session._id}>
            <div className="session-patient-info">
              <div className="session-avatar-fallback">
                {getPatientName(session).charAt(0).toUpperCase()}
              </div>
              <div className="session-patient-details">
                <span className="session-patient-name">{getPatientName(session)}</span>
                <span className={`session-status-badge ${getStatusBadgeClass(session.status)}`}>
                  {session.status?.replace('-', ' ') || 'scheduled'}
                </span>
              </div>
            </div>
            <div className="session-time-info">
              <div>
                <FaCalendarAlt />
                <span>{formatDate(session.scheduledDate)}</span>
              </div>
              <div>
                <FaClock />
                <span>{formatTimeRange(session.scheduledTime, session.duration)}</span>
              </div>
            </div>
            <div className="session-actions">
              {activeTab === 'upcoming' && (
                <>
                  <button className="btn btn-primary-solid">Start Session</button>
                  <button className="btn btn-secondary-outline">Reschedule</button>
                </>
              )}
              {activeTab === 'past' && (
                <button className="btn btn-secondary-outline">View Notes</button>
              )}
              {activeTab === 'requests' && (
                <div className="session-request-actions">
                  <button className="btn btn-primary-solid">Approve</button>
                  <button className="btn btn-secondary-outline">Decline</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManagement;