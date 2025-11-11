// src/patient/pages/CounsellorList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './PatientDashboard.css';
import { FaSearch, FaCommentDots, FaVideo } from 'react-icons/fa';
import apiClient from '../../services/apiClient';

const formatSpecialties = (specialties = []) => {
  if (!Array.isArray(specialties) || specialties.length === 0) {
    return 'General counsellor';
  }
  return specialties.slice(0, 2).join(', ');
};

const CounsellorList = () => {
  const [pendingSearch, setPendingSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceMode, setServiceMode] = useState('');
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(pendingSearch.trim()), 400);
    return () => clearTimeout(handler);
  }, [pendingSearch]);

  useEffect(() => {
    let isMounted = true;

    const fetchCounsellors = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiClient.get('/counselor/directory', {
          params: {
            q: searchTerm || undefined,
            serviceMode: serviceMode || undefined,
            limit: 12
          }
        });

        if (!isMounted) {
          return;
        }

        setCounsellors(result || []);
        setIsAuthenticated(true);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status === 401) {
          setIsAuthenticated(false);
          setError('Please sign in to browse counsellors.');
        } else {
          setError(fetchError.message || 'Unable to load counsellors.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCounsellors();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, serviceMode]);

  const emptyMessage = useMemo(() => {
    if (!isAuthenticated) {
      return 'Sign in to discover available counsellors.';
    }
    if (searchTerm || serviceMode) {
      return 'No counsellors match your filters yet. Try adjusting your search.';
    }
    return 'Counsellors will appear here once they are approved.';
  }, [isAuthenticated, searchTerm, serviceMode]);

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
          <input
            type="text"
            placeholder="Search counsellors by name or specialization..."
            value={pendingSearch}
            onChange={(event) => setPendingSearch(event.target.value)}
          />
        </div>
        <div className="counsellor-filter-select">
          <select
            value={serviceMode}
            onChange={(event) => setServiceMode(event.target.value)}
          >
            <option value="">All session types</option>
            <option value="virtual">Virtual sessions</option>
            <option value="in-person">In-person sessions</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* --- Counsellor Grid --- */}
      <div className="counsellor-grid">
        {loading && (
          <div className="counsellor-card loading-card">
            <h3>Loading counsellors…</h3>
            <p>Fetching specialists tailored to your needs.</p>
          </div>
        )}

        {!loading && error && (
          <div className="counsellor-card error-card">
            <h3>{error}</h3>
            {!isAuthenticated && <p>Authentication is required to view this list.</p>}
          </div>
        )}

        {!loading && !error && counsellors.length === 0 && (
          <div className="counsellor-card empty-card">
            <h3>{emptyMessage}</h3>
          </div>
        )}

        {!loading && !error && counsellors.map((counsellor) => (
          <div className="counsellor-card" key={counsellor.id}>
            <div className="counsellor-avatar-fallback">
              {counsellor.fullName?.charAt(0).toUpperCase() || counsellor.email?.charAt(0).toUpperCase()}
            </div>
            <h3>{counsellor.fullName || counsellor.email}</h3>
            <p>{formatSpecialties(counsellor.specialties)}</p>
            <div className="counsellor-card-meta">
              <span>{counsellor.metrics?.totalSessions || 0} sessions</span>
              <span>{counsellor.metrics?.activePatients || 0} active patients</span>
            </div>
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