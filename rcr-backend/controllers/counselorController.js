import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

/**
 * Get counselor dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const counselorId = req.user.id;

    const [
      totalPatients,
      upcomingSessions,
      completedSessions,
      pendingMessages
    ] = await Promise.all([
      Session.distinct('patient', { counselor: counselorId }),
      Session.countDocuments({
        counselor: counselorId,
        status: 'scheduled',
        scheduledDate: { $gte: new Date() }
      }),
      Session.countDocuments({
        counselor: counselorId,
        status: 'completed'
      }),
      Message.countDocuments({
        receiver: counselorId,
        isRead: false
      })
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSessions = await Session.countDocuments({
      counselor: counselorId,
      createdAt: { $gte: oneWeekAgo }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalPatients: totalPatients.length,
          upcomingSessions,
          completedSessions,
          pendingMessages,
          recentSessions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get all patients assigned to counselor
 */
export const getMyPatients = async (req, res) => {
  try {
    const counselorId = req.user.id;

    const sessions = await Session.find({ counselor: counselorId })
      .populate({
        path: 'patient',
        select: '-password',
        populate: {
          path: 'profile',
          model: 'Profile'
        }
      })
      .sort({ scheduledDate: -1 });

    const patientMap = new Map();

    sessions.forEach(session => {
      const patientId = session.patient._id.toString();
      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          patient: session.patient,
          lastSession: session.scheduledDate,
          sessionCount: 0
        });
      }
      const patientData = patientMap.get(patientId);
      patientData.sessionCount += 1;
      if (session.scheduledDate > patientData.lastSession) {
        patientData.lastSession = session.scheduledDate;
      }
    });

    const patients = Array.from(patientMap.values()).map(item => ({
      id: item.patient._id,
      email: item.patient.email,
      role: item.patient.role,
      profile: item.patient.profile,
      lastSession: item.lastSession,
      sessionCount: item.sessionCount
    }));

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

/**
 * Get patient profile by ID
 */
export const getPatientProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const counselorId = req.user.id;

    const hasSession = await Session.findOne({
      counselor: counselorId,
      patient: patientId
    });

    if (!hasSession) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this patient'
      });
    }

    const patient = await User.findById(patientId)
      .select('-password')
      .populate('profile');

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const sessions = await Session.find({
      counselor: counselorId,
      patient: patientId
    }).sort({ scheduledDate: -1 }).limit(10);

    res.json({
      success: true,
      data: {
        patient,
        recentSessions: sessions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient profile',
      error: error.message
    });
  }
};

