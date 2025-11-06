import Session from '../models/Session.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { sendSessionReminder } from '../utils/email.js';

/**
 * Get all sessions for counselor
 */
export const getSessions = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { status, type } = req.query;

    const query = { counselor: counselorId };

    if (status) {
      query.status = status;
    } else {
      const now = new Date();
      const upcoming = await Session.find({
        counselor: counselorId,
        status: 'scheduled',
        scheduledDate: { $gte: now }
      })
        .populate({
          path: 'patient',
          select: '-password',
          populate: {
            path: 'profile',
            model: 'Profile',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ scheduledDate: 1 });

      const past = await Session.find({
        counselor: counselorId,
        $or: [
          { status: 'completed' },
          { status: 'cancelled' },
          { scheduledDate: { $lt: now } }
        ]
      })
        .populate({
          path: 'patient',
          select: '-password',
          populate: {
            path: 'profile',
            model: 'Profile',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ scheduledDate: -1 })
        .limit(50);

      return res.json({
        success: true,
        data: {
          upcoming,
          past
        }
      });
    }

    if (type) {
      query.sessionType = type;
    }

    const sessions = await Session.find(query)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort({ scheduledDate: status === 'scheduled' ? 1 : -1 });

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
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
      })
      .populate({
        path: 'counselor',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
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

    const session = await Session.create({
      counselor: counselorId,
      patient: patientId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration: duration || 60,
      sessionType: sessionType || 'individual',
      notes: notes || '',
      status: 'scheduled'
    });

    const populatedSession = await Session.findById(session._id)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
      })
      .populate({
        path: 'counselor',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName'
        }
      });

    const patientWithProfile = await User.findById(patientId).populate('profile');
    const counselorWithProfile = await User.findById(counselorId).populate('profile');
    
    if (patientWithProfile && counselorWithProfile && patientWithProfile.profile && counselorWithProfile.profile) {
      try {
        await sendSessionReminder(populatedSession, patientWithProfile, counselorWithProfile);
      } catch (emailError) {
        console.error('Error sending session reminder email:', emailError);
      }
    }

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
      sessionSummary
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

    if (scheduledDate) session.scheduledDate = new Date(scheduledDate);
    if (scheduledTime) session.scheduledTime = scheduledTime;
    if (duration) session.duration = duration;
    if (status) {
      session.status = status;
      if (status === 'in-progress') {
        session.startedAt = new Date();
      } else if (status === 'completed') {
        session.endedAt = new Date();
      } else if (status === 'cancelled') {
        session.cancelledAt = new Date();
      }
    }
    if (notes !== undefined) session.notes = notes;
    if (sessionSummary !== undefined) session.sessionSummary = sessionSummary;

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
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

    const newSession = await Session.create({
      counselor: oldSession.counselor,
      patient: oldSession.patient,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration: duration || oldSession.duration,
      sessionType: oldSession.sessionType,
      status: 'scheduled',
      rescheduledFrom: oldSession._id
    });

    oldSession.status = 'rescheduled';
    oldSession.rescheduledTo = newSession._id;
    await oldSession.save();

    const populatedSession = await Session.findById(newSession._id)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
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

    session.status = 'cancelled';
    session.cancelledAt = new Date();
    session.cancellationReason = cancellationReason || '';

    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled successfully',
      data: session
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

    session.status = 'in-progress';
    session.startedAt = new Date();
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'firstName lastName profilePicture'
        }
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

