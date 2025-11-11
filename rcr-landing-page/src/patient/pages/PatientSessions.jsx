// src/patient/pages/PatientSessions.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientDashboard.css';
import apiClient from '../../services/apiClient';

const PatientSessions = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [counsellors, setCounsellors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [sessions, setSessions] = useState({
    upcoming: [],
    past: [],
    pendingRequests: []
  });
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingCounsellors, setLoadingCounsellors] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [formState, setFormState] = useState({
    counselorId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [bookingStatus, setBookingStatus] = useState({
    submitting: false,
    success: null,
    message: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSessions = async () => {
      setLoadingSessions(true);
      setError(null);

      try {
        const result = await apiClient.get('/sessions/patient');

        if (!isMounted) {
          return;
        }

        setSessions({
          upcoming: result?.upcoming || [],
          past: result?.past || [],
          pendingRequests: result?.pendingRequests || []
        });
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status === 401) {
          setIsAuthenticated(false);
          setError('Please sign in to manage your sessions.');
        } else {
          setError(fetchError.message || 'Unable to load sessions.');
        }
      } finally {
        if (isMounted) {
          setLoadingSessions(false);
        }
      }
    };

    fetchSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCounsellors = async () => {
      setLoadingCounsellors(true);
      setError(null);

      try {
        const result = await apiClient.get('/counselor/directory', {
          params: { limit: 6, serviceMode: 'virtual' }
        });

        if (!isMounted) {
          return;
        }

        setCounsellors(result || []);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        if (fetchError.status !== 401) {
          setError(fetchError.message || 'Unable to load counsellors.');
        }
      } finally {
        if (isMounted) {
          setLoadingCounsellors(false);
        }
      }
    };

    fetchCounsellors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      if (!selectedCounsellor) {
        setAvailableSlots([]);
        setFormState((prev) => ({ ...prev, counselorId: '', date: '', time: '' }));
        return;
      }

      try {
        const result = await apiClient.get(`/counselor/directory/${selectedCounsellor}`);

        if (!isMounted) {
          return;
        }

        const slots = result?.availability?.upcomingSlots || [];
        setAvailableSlots(slots);

        if (slots.length > 0) {
          const firstSlot = slots[0];
          setFormState((prev) => ({
            ...prev,
            counselorId: selectedCounsellor,
            date: firstSlot.date?.slice(0, 10) || '',
            time: firstSlot.start || ''
          }));
        } else {
          setFormState((prev) => ({
            ...prev,
            counselorId: selectedCounsellor,
            date: '',
            time: ''
          }));
        }
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }
        setAvailableSlots([]);
      }
    };

    fetchAvailability();

    return () => {
      isMounted = false;
    };
  }, [selectedCounsellor]);

  const slotDates = useMemo(() => {
    return Array.from(new Set(availableSlots.map((slot) => slot.date?.slice(0, 10)).filter(Boolean)));
  }, [availableSlots]);

  const timeOptions = useMemo(() => {
    if (!formState.date) {
      return [];
    }
    return availableSlots.filter((slot) => slot.date?.slice(0, 10) === formState.date);
  }, [availableSlots, formState.date]);

  const handleBookSession = async (event) => {
    event.preventDefault();
    if (!formState.counselorId || !formState.date || !formState.time) {
      setBookingStatus({
        submitting: false,
        success: false,
        message: 'Please select a counsellor, date, and time.'
      });
      return;
    }

    setBookingStatus({
      submitting: true,
      success: null,
      message: null
    });

    try {
      const payload = {
        counselorId: formState.counselorId,
        scheduledDate: formState.date,
        scheduledTime: formState.time,
        sessionType: 'individual',
        notes: formState.notes?.trim() || ''
      };
      const response = await apiClient.post('/sessions/patient/request', payload);

      setSessions((prev) => ({
        ...prev,
        pendingRequests: [response, ...prev.pendingRequests]
      }));

      setBookingStatus({
        submitting: false,
        success: true,
        message: 'Session request submitted. We will notify you once it is confirmed.'
      });
    } catch (submitError) {
      setBookingStatus({
        submitting: false,
        success: false,
        message: submitError.message || 'Unable to request a session. Please try again later.'
      });
    }
  };

  const formatDate = (value) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  };

  const formatTime = (value) => {
    if (!value) {
      return '—';
    }
    const [hours, minutes] = value.split(':').map((segment) => Number(segment));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return value;
    }
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: 'numeric'
    });
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return formatter.format(date);
  };

  const getCounsellorName = (session) => {
    const profile = session?.counselor?.profile;
    if (profile) {
      const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
      if (name) {
        return name;
      }
    }
    return session?.counselor?.email || 'Counsellor';
  };

  return (
    <div className="session-page-layout">
      
      {/* --- Main Booking Area (Left Column) --- */}
      <div className="session-booking-main">
        <div className="patient-page-header">
          <h1>Book a New Session</h1>
        </div>

        <form className="booking-section" onSubmit={handleBookSession}>
          <h3>Choose Counsellor & Time</h3>

          <div className="booking-field">
            <label htmlFor="counsellor">Counsellor</label>
            <select
              id="counsellor"
              value={selectedCounsellor}
              onChange={(event) => setSelectedCounsellor(event.target.value)}
              disabled={loadingCounsellors}
            >
              <option value="">Select a counsellor</option>
              {counsellors.map((counsellor) => (
                <option key={counsellor.id} value={counsellor.id}>
                  {counsellor.fullName || counsellor.email}
                </option>
              ))}
            </select>
            </div>

          <div className="booking-field">
            <label htmlFor="session-date">Preferred Date</label>
            <select
              id="session-date"
              value={formState.date}
              onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value, time: '' }))}
              disabled={availableSlots.length === 0}
            >
              <option value="">Select a date</option>
              {slotDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
            </div>

          <div className="booking-field">
            <label htmlFor="session-time">Available Time</label>
            <select
              id="session-time"
              value={formState.time}
              onChange={(event) => setFormState((prev) => ({ ...prev, time: event.target.value }))}
              disabled={!formState.date || timeOptions.length === 0}
            >
              <option value="">Select a time</option>
              {timeOptions.map((slot) => (
                <option key={`${slot.date}-${slot.start}`} value={slot.start}>
                  {formatTime(slot.start)} ({slot.isVirtual ? 'Virtual' : 'In-person'})
                </option>
              ))}
            </select>
          </div>

          <div className="booking-field">
            <label htmlFor="session-notes">Notes (optional)</label>
            <textarea
              id="session-notes"
              rows={3}
              placeholder="Share any specific topics you would like to cover."
              value={formState.notes}
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>

          {bookingStatus.message && (
            <div className={`booking-status ${bookingStatus.success ? 'success' : 'error'}`}>
              {bookingStatus.message}
            </div>
          )}

          <button
            type="submit"
            className="book-session-btn"
            disabled={!formState.counselorId || !formState.date || !formState.time || bookingStatus.submitting}
          >
            {bookingStatus.submitting ? 'Submitting request…' : 'Request Session'}
          </button>
        </form>
      </div>

      {/* --- Upcoming Sessions (Right Column) --- */}
      <aside className="upcoming-sessions-sidebar">
        <h2>My Upcoming Sessions</h2>
        {loadingSessions && (
          <div className="upcoming-session-item loading-item">
            <div className="session-item-info">
              <h4>Loading your sessions…</h4>
            </div>
          </div>
        )}

        {!loadingSessions && error && (
          <div className="upcoming-session-item error-item">
            <div className="session-item-info">
              <h4>{error}</h4>
            </div>
          </div>
        )}

        {!loadingSessions && !error && sessions.upcoming.length === 0 && (
          <div className="upcoming-session-item empty-item">
            <div className="session-item-info">
              <h4>No upcoming sessions</h4>
              <p>Use the form to request your next appointment.</p>
            </div>
          </div>
        )}

        {!loadingSessions && !error && sessions.upcoming.map((session) => (
          <div className="upcoming-session-item" key={session._id}>
            <div className="session-item-avatar">
              {getCounsellorName(session).charAt(0).toUpperCase()}
            </div>
            <div className="session-item-info">
              <h4>{getCounsellorName(session)}</h4>
              <p>{formatDate(session.scheduledDate)} · {formatTime(session.scheduledTime)}</p>
            </div>
            <Link to="#" className="session-item-details-btn">Details</Link>
          </div>
        ))}

        {sessions.pendingRequests.length > 0 && (
          <div className="pending-requests">
            <h3>Pending Requests</h3>
            {sessions.pendingRequests.map((request) => (
              <div className="upcoming-session-item pending-item" key={request._id}>
                <div className="session-item-avatar">?</div>
                <div className="session-item-info">
                  <h4>{getCounsellorName(request)}</h4>
                  <p>Requested for {formatDate(request.scheduledDate)} · {formatTime(request.scheduledTime)}</p>
                  <span className="pending-label">Awaiting confirmation</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

export default PatientSessions;