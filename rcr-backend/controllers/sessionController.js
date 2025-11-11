import Session from '../models/Session.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { sendSessionReminder } from '../utils/email.js';

const ACTIVE_STATUSES = ['requested', 'scheduled', 'in-progress'];

const timeToMinutes = (time) => {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }
  const [hours, minutes] = time.split(':').map((segment) => Number(segment));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return (hours * 60) + minutes;
};

const normalizeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

const recordStatusChange = (session, newStatus, userId) => {
  if (!newStatus || session.status === newStatus) {
    return;
  }

  session.status = newStatus;
  session.statusHistory = session.statusHistory || [];
  session.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: userId
  });

  if (newStatus === 'in-progress') {
    session.startedAt = session.startedAt || new Date();
  } else if (newStatus === 'completed') {
    const completionTimestamp = new Date();
    session.endedAt = session.endedAt || completionTimestamp;
    session.completedAt = completionTimestamp;
  } else if (newStatus === 'cancelled') {
    session.cancelledAt = new Date();
  } else if (newStatus === 'scheduled') {
    session.confirmedAt = new Date();
  }
};

const hasSchedulingConflict = async ({
  counselorId,
  scheduledDate,
  scheduledTime,
  excludeSessionId
}) => {
  const conflictQuery = {
    counselor: counselorId,
    scheduledDate,
    scheduledTime,
    status: { $in: ACTIVE_STATUSES }
  };

  if (excludeSessionId) {
    conflictQuery._id = { $ne: excludeSessionId };
  }

  const conflictingSession = await Session.findOne(conflictQuery).select('_id');
  return Boolean(conflictingSession);
};

const isDateException = (exceptions = [], targetDate) => {
  const targetTime = targetDate.getTime();
  return exceptions.find((exception) => {
    const exceptionDate = normalizeDate(exception.date);
    return exceptionDate && exceptionDate.getTime() === targetTime;
  });
};

const isWithinCounselorAvailability = (profile, scheduledDate, scheduledTime) => {
  if (!profile) {
    return { available: false, reason: 'Counselor profile not found' };
  }

  if (profile.isAvailable === false) {
    return { available: false, reason: 'Counselor is currently unavailable' };
  }

  const normalizedDate = normalizeDate(scheduledDate);
  if (!normalizedDate) {
    return { available: false, reason: 'Invalid scheduled date' };
  }

  const minutes = timeToMinutes(scheduledTime);
  if (minutes === null) {
    return { available: false, reason: 'Invalid scheduled time' };
  }

  const exceptions = profile.availability?.exceptions;
  const exception = isDateException(exceptions, normalizedDate);
  if (exception && exception.isAvailable === false) {
    return { available: false, reason: exception.reason || 'Counselor unavailable on selected date' };
  }

  const weeklySchedule = profile.availability?.weeklySchedule || [];
  if (!weeklySchedule.length) {
    return { available: true };
  }

  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  const weekday = formatter.format(normalizedDate).toLowerCase();
  const daySchedule = weeklySchedule.find((entry) => entry.day === weekday);

  if (!daySchedule || !Array.isArray(daySchedule.slots) || !daySchedule.slots.length) {
    return { available: false, reason: 'Counselor has no availability on the selected day' };
  }

  const slotMatch = daySchedule.slots.some((slot) => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    if (slotStart === null || slotEnd === null) {
      return false;
    }
    return slotStart <= minutes && minutes < slotEnd;
  });

  if (!slotMatch) {
    return { available: false, reason: 'Selected time is outside counselor hours' };
  }

  if (exception && exception.isAvailable === true) {
    return { available: true };
  }

  return { available: true };
};

const emitSessionEvent = (req, recipients = [], event, payload) => {
  const io = req.app.get('io');
  if (!io || !Array.isArray(recipients)) {
    return;
  }

  const uniqueRecipients = [...new Set(recipients.filter(Boolean))];
  uniqueRecipients.forEach((recipientId) => {
    io.to(`user:${recipientId}`).emit(event, payload);
  });
};

const patientPopulateConfig = {
  path: 'patient',
  select: '-password',
  populate: {
    path: 'profile',
    model: 'Profile',
    select: 'firstName lastName profilePicture cancerType'
  }
};

const counselorPopulateConfig = {
  path: 'counselor',
  select: '-password',
  populate: {
    path: 'profile',
    model: 'Profile',
    select: 'firstName lastName profilePicture specialties specialization'
  }
};

/**
 * Get all sessions for counselor
 */
export const getSessions = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { status, type } = req.query;

    const now = new Date();

    if (!status) {
      const [pendingRequests, upcomingSessions, pastSessions] = await Promise.all([
        Session.find({
          counselor: counselorId,
          status: 'requested',
          scheduledDate: { $gte: now }
        })
          .populate(patientPopulateConfig)
          .sort({ scheduledDate: 1, scheduledTime: 1 }),
        Session.find({
          counselor: counselorId,
          status: { $in: ['scheduled', 'in-progress'] },
          scheduledDate: { $gte: now }
        })
          .populate(patientPopulateConfig)
          .sort({ scheduledDate: 1, scheduledTime: 1 }),
        Session.find({
          counselor: counselorId,
          $or: [
            { status: { $in: ['completed', 'cancelled'] } },
            { scheduledDate: { $lt: now } }
          ]
        })
          .populate(patientPopulateConfig)
          .sort({ scheduledDate: -1, scheduledTime: -1 })
          .limit(50)
      ]);

      return res.json({
        success: true,
        data: {
          pendingRequests,
          upcoming: upcomingSessions,
          past: pastSessions
        }
      });
    }

    const query = {
      counselor: counselorId,
      status
    };

    if (type) {
      query.sessionType = type;
    }

    const sessions = await Session.find(query)
      .populate(patientPopulateConfig)
      .sort({ scheduledDate: status === 'scheduled' ? 1 : -1, scheduledTime: status === 'scheduled' ? 1 : -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

/**
 * Get single session by ID
 */
export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const counselorId = req.user.id;

    const session = await Session.findOne({
      _id: sessionId,
      counselor: counselorId
    })
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig)
      .populate({
        path: 'statusHistory.changedBy',
        select: 'email role'
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

/**
 * Create new session
 */
export const createSession = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const {
      patientId,
      scheduledDate,
      scheduledTime,
      duration,
      sessionType,
      notes
    } = req.body;

    if (!patientId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, scheduled date, and time are required'
      });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const scheduledDateObj = normalizeDate(scheduledDate);
    if (!scheduledDateObj) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduled date provided'
      });
    }

    if (timeToMinutes(scheduledTime) === null) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in HH:mm format'
      });
    }

    const durationInMinutes = Number(duration) || 60;

    const hasConflict = await hasSchedulingConflict({
      counselorId,
      scheduledDate: scheduledDateObj,
      scheduledTime
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }

    const session = await Session.create({
      counselor: counselorId,
      patient: patientId,
      scheduledDate: scheduledDateObj,
      scheduledTime,
      duration: durationInMinutes,
      sessionType: sessionType || 'individual',
      notes: notes || '',
      status: 'scheduled',
      requestedBy: counselorId,
      requestedAt: new Date(),
      confirmedBy: counselorId,
      confirmedAt: new Date(),
      statusHistory: [{
        status: 'scheduled',
        changedAt: new Date(),
        changedBy: counselorId
      }]
    });

    const populatedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig);

    const patientWithProfile = await User.findById(patientId).populate('profile');
    const counselorWithProfile = await User.findById(counselorId).populate('profile');
    
    if (patientWithProfile && counselorWithProfile && patientWithProfile.profile && counselorWithProfile.profile) {
      try {
        await sendSessionReminder(populatedSession, patientWithProfile, counselorWithProfile);
      } catch (emailError) {
        console.error('Error sending session reminder email:', emailError);
      }
    }

    emitSessionEvent(req, [patientId, counselorId], 'session-scheduled', {
      session: populatedSession
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

/**
 * Update session
 */
export const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const counselorId = req.user.id;
    const {
      scheduledDate,
      scheduledTime,
      duration,
      status,
      notes,
      sessionSummary,
      cancellationReason
    } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      counselor: counselorId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (scheduledDate || scheduledTime) {
      const newDate = scheduledDate ? normalizeDate(scheduledDate) : session.scheduledDate;
      if (!newDate) {
        return res.status(400).json({
          success: false,
          message: 'Invalid scheduled date provided'
        });
      }

      const newTime = scheduledTime || session.scheduledTime;
      if (timeToMinutes(newTime) === null) {
        return res.status(400).json({
          success: false,
          message: 'Scheduled time must be in HH:mm format'
        });
      }

      const conflict = await hasSchedulingConflict({
        counselorId,
        scheduledDate: newDate,
        scheduledTime: newTime,
        excludeSessionId: sessionId
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Updated time slot conflicts with another session'
        });
      }

      session.scheduledDate = newDate;
      session.scheduledTime = newTime;
    }

    if (duration) {
      session.duration = Number(duration);
    }
    if (status) {
      recordStatusChange(session, status, counselorId);
      if (status === 'scheduled') {
        session.confirmedBy = counselorId;
        session.confirmedAt = new Date();
      }
      if (status === 'cancelled' && cancellationReason) {
        session.cancellationReason = cancellationReason;
      }
    }
    if (notes !== undefined) {
      session.notes = notes;
    }
    if (sessionSummary !== undefined) {
      session.sessionSummary = sessionSummary;
    }

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig)
      .populate({
        path: 'statusHistory.changedBy',
        select: 'email role'
      });

    emitSessionEvent(req, [updatedSession.patient?._id, counselorId], 'session-updated', {
      session: updatedSession
    });

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

/**
 * Reschedule session
 */
export const rescheduleSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const counselorId = req.user.id;
    const { scheduledDate, scheduledTime, duration } = req.body;

    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'New scheduled date and time are required'
      });
    }

    const oldSession = await Session.findOne({
      _id: sessionId,
      counselor: counselorId
    });

    if (!oldSession) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const newScheduledDate = normalizeDate(scheduledDate);
    if (!newScheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduled date provided'
      });
    }

    if (timeToMinutes(scheduledTime) === null) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in HH:mm format'
      });
    }

    const conflict = await hasSchedulingConflict({
      counselorId,
      scheduledDate: newScheduledDate,
      scheduledTime,
      excludeSessionId: oldSession._id
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }

    const newSession = await Session.create({
      counselor: oldSession.counselor,
      patient: oldSession.patient,
      scheduledDate: newScheduledDate,
      scheduledTime,
      duration: duration || oldSession.duration,
      sessionType: oldSession.sessionType,
      status: 'scheduled',
      rescheduledFrom: oldSession._id,
      requestedBy: counselorId,
      requestedAt: new Date(),
      confirmedBy: counselorId,
      confirmedAt: new Date(),
      statusHistory: [{
        status: 'scheduled',
        changedAt: new Date(),
        changedBy: counselorId
      }]
    });

    recordStatusChange(oldSession, 'rescheduled', counselorId);
    oldSession.rescheduledTo = newSession._id;
    await oldSession.save();

    const populatedSession = await Session.findById(newSession._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig);

    emitSessionEvent(req, [populatedSession.patient?._id, counselorId], 'session-rescheduled', {
      previousSessionId: oldSession._id,
      session: populatedSession
    });

    res.json({
      success: true,
      message: 'Session rescheduled successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rescheduling session',
      error: error.message
    });
  }
};

/**
 * Cancel session
 */
export const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const counselorId = req.user.id;
    const { cancellationReason } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      counselor: counselorId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a session that is already completed or cancelled'
      });
    }

    recordStatusChange(session, 'cancelled', counselorId);
    session.cancellationReason = cancellationReason || '';
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig);

    emitSessionEvent(req, [populatedSession.patient?._id, counselorId], 'session-cancelled', {
      session: populatedSession,
      cancelledBy: counselorId
    });

    res.json({
      success: true,
      message: 'Session cancelled successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling session',
      error: error.message
    });
  }
};

/**
 * Start session
 */
export const startSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const counselorId = req.user.id;

    const session = await Session.findOne({
      _id: sessionId,
      counselor: counselorId,
      status: 'scheduled'
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or cannot be started'
      });
    }

    recordStatusChange(session, 'in-progress', counselorId);
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig);

    emitSessionEvent(req, [populatedSession.patient?._id, counselorId], 'session-started', {
      session: populatedSession
    });

    res.json({
      success: true,
      message: 'Session started successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting session',
      error: error.message
    });
  }
};


/**
 * Get sessions for patient
 */
export const getPatientSessions = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { status, type } = req.query;
    const now = new Date();

    if (!status) {
      const [requests, upcoming, past] = await Promise.all([
        Session.find({
          patient: patientId,
          status: 'requested'
        })
          .populate(counselorPopulateConfig)
          .sort({ scheduledDate: 1, scheduledTime: 1 }),
        Session.find({
          patient: patientId,
          status: { $in: ['scheduled', 'in-progress'] },
          scheduledDate: { $gte: now }
        })
          .populate(counselorPopulateConfig)
          .sort({ scheduledDate: 1, scheduledTime: 1 }),
        Session.find({
          patient: patientId,
          $or: [
            { status: { $in: ['completed', 'cancelled'] } },
            { scheduledDate: { $lt: now } }
          ]
        })
          .populate(counselorPopulateConfig)
          .sort({ scheduledDate: -1, scheduledTime: -1 })
          .limit(50)
      ]);

      return res.json({
        success: true,
        data: {
          pendingRequests: requests,
          upcoming,
          past
        }
      });
    }

    const query = {
      patient: patientId,
      status
    };

    if (type) {
      query.sessionType = type;
    }

    const sessions = await Session.find(query)
      .populate(counselorPopulateConfig)
      .sort({ scheduledDate: status === 'scheduled' ? 1 : -1, scheduledTime: status === 'scheduled' ? 1 : -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient sessions',
      error: error.message
    });
  }
};

/**
 * Get session for patient by ID
 */
export const getPatientSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const patientId = req.user.id;

    const session = await Session.findOne({
      _id: sessionId,
      patient: patientId
    })
      .populate(counselorPopulateConfig)
      .populate(patientPopulateConfig)
      .populate({
        path: 'statusHistory.changedBy',
        select: 'email role'
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

/**
 * Patient requests a session with a counselor
 */
export const requestSession = async (req, res) => {
  try {
    const patientId = req.user.id;
    const {
      counselorId,
      scheduledDate,
      scheduledTime,
      duration,
      sessionType,
      notes
    } = req.body;

    if (!counselorId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Counselor, date, and time are required to request a session'
      });
    }

    const counselor = await User.findOne({
      _id: counselorId,
      role: 'counselor',
      isApproved: true,
      approvalStatus: 'approved'
    }).populate('profile');

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    const scheduledDateObj = normalizeDate(scheduledDate);
    if (!scheduledDateObj) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduled date provided'
      });
    }

    if (timeToMinutes(scheduledTime) === null) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in HH:mm format'
      });
    }

    const availabilityCheck = isWithinCounselorAvailability(counselor.profile, scheduledDateObj, scheduledTime);
    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        message: availabilityCheck.reason || 'Counselor is unavailable at the chosen time'
      });
    }

    const conflict = await hasSchedulingConflict({
      counselorId,
      scheduledDate: scheduledDateObj,
      scheduledTime
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }

    const requesterProfile = await Profile.findOne({ user: patientId });
    if (!requesterProfile) {
      return res.status(400).json({
        success: false,
        message: 'Complete your profile before requesting a session'
      });
    }

    const durationMinutes = Number(duration) || 60;

    const session = await Session.create({
      counselor: counselorId,
      patient: patientId,
      scheduledDate: scheduledDateObj,
      scheduledTime,
      duration: durationMinutes,
      sessionType: sessionType || 'individual',
      notes: '',
      requestNotes: notes || '',
      status: 'requested',
      requestedBy: patientId,
      requestedAt: new Date(),
      statusHistory: [{
        status: 'requested',
        changedAt: new Date(),
        changedBy: patientId
      }]
    });

    const populatedSession = await Session.findById(session._id)
      .populate(counselorPopulateConfig)
      .populate(patientPopulateConfig);

    emitSessionEvent(req, [counselorId, patientId], 'session-requested', {
      session: populatedSession
    });

    res.status(201).json({
      success: true,
      message: 'Session request submitted successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error requesting session',
      error: error.message
    });
  }
};

/**
 * Counselor responds to session request
 */
export const respondToSessionRequest = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { sessionId } = req.params;
    const {
      action,
      scheduledDate,
      scheduledTime,
      duration,
      responseMessage
    } = req.body;

    if (!['approve', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be approve or decline'
      });
    }

    const session = await Session.findOne({
      _id: sessionId,
      counselor: counselorId
    }).populate(patientPopulateConfig);

    if (!session || session.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'Session request not found or already handled'
      });
    }

    if (action === 'decline') {
      recordStatusChange(session, 'cancelled', counselorId);
      session.cancellationReason = responseMessage || 'Request declined by counselor';
      await session.save();

      const declinedSession = await Session.findById(session._id)
        .populate(patientPopulateConfig)
        .populate(counselorPopulateConfig);

      emitSessionEvent(req, [session.patient, counselorId], 'session-declined', {
        session: declinedSession,
        message: responseMessage
      });

      return res.json({
        success: true,
        message: 'Session request declined',
        data: declinedSession
      });
    }

    const targetDate = scheduledDate ? normalizeDate(scheduledDate) : session.scheduledDate;
    if (!targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduled date provided'
      });
    }

    const targetTime = scheduledTime || session.scheduledTime;
    if (timeToMinutes(targetTime) === null) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in HH:mm format'
      });
    }

    const conflict = await hasSchedulingConflict({
      counselorId,
      scheduledDate: targetDate,
      scheduledTime: targetTime,
      excludeSessionId: session._id
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is no longer available'
      });
    }

    session.scheduledDate = targetDate;
    session.scheduledTime = targetTime;
    session.duration = duration ? Number(duration) : session.duration;
    session.notes = responseMessage || session.notes;
    session.confirmedBy = counselorId;
    session.confirmedAt = new Date();
    recordStatusChange(session, 'scheduled', counselorId);

    await session.save();

    const approvedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig)
      .populate({
        path: 'statusHistory.changedBy',
        select: 'email role'
      });

    emitSessionEvent(req, [session.patient, counselorId], 'session-approved', {
      session: approvedSession
    });

    res.json({
      success: true,
      message: 'Session request approved',
      data: approvedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error responding to session request',
      error: error.message
    });
  }
};

/**
 * Patient cancels a session or request
 */
export const cancelSessionByPatient = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const patientId = req.user.id;
    const { cancellationReason } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      patient: patientId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a session that is already completed or cancelled'
      });
    }

    recordStatusChange(session, 'cancelled', patientId);
    session.cancellationReason = cancellationReason || 'Cancelled by patient';
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate(patientPopulateConfig)
      .populate(counselorPopulateConfig);

    emitSessionEvent(req, [session.counselor, patientId], 'session-cancelled', {
      session: populatedSession,
      cancelledBy: patientId
    });

    res.json({
      success: true,
      message: 'Session cancelled successfully',
      data: populatedSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling session',
      error: error.message
    });
  }
};

