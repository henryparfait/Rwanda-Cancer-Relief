import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import { mapSessionStats } from '../utils/analyticsHelpers.js';

const allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const validServiceModes = ['in-person', 'virtual', 'hybrid'];

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const timeToMinutes = (time) => {
  if (!timeRegex.test(time)) {
    return null;
  }
  const [hours, minutes] = time.split(':').map((segment) => Number(segment));
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

const validateWeeklySchedule = (weeklySchedule = []) => {
  if (!Array.isArray(weeklySchedule)) {
    return false;
  }

  return weeklySchedule.every((entry) => {
    if (!entry || !entry.day || !allowedDays.includes(entry.day.toLowerCase())) {
      return false;
    }
    if (!Array.isArray(entry.slots) || entry.slots.length === 0) {
      return false;
    }
    return entry.slots.every((slot) => {
      if (!slot?.start || !slot?.end) {
        return false;
      }
      if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
        return false;
      }
      return timeToMinutes(slot.start) < timeToMinutes(slot.end);
    });
  });
};

const formatWeeklySchedule = (weeklySchedule = []) => weeklySchedule.map((entry) => ({
  day: entry.day.toLowerCase(),
  slots: (entry.slots || []).map((slot) => ({
    start: slot.start,
    end: slot.end,
    isVirtual: slot.isVirtual !== undefined ? Boolean(slot.isVirtual) : true
  }))
}));

const sanitizeServiceModes = (serviceModes = []) => {
  if (!Array.isArray(serviceModes)) {
    return [];
  }
  const sanitized = serviceModes
    .map((mode) => (typeof mode === 'string' ? mode.toLowerCase() : null))
    .filter((mode) => validServiceModes.includes(mode));
  return [...new Set(sanitized)];
};

const sanitizeStringsArray = (values = []) => {
  if (!Array.isArray(values)) {
    return [];
  }
  return [...new Set(values.filter((value) => typeof value === 'string' && value.trim().length > 0).map((value) => value.trim()))];
};

const buildAvailabilityCondition = (day, time) => {
  if (!day) {
    return null;
  }
  const lowerDay = day.toLowerCase();
  if (!allowedDays.includes(lowerDay)) {
    return null;
  }

  const condition = {
    'availability.weeklySchedule': {
      $elemMatch: {
        day: lowerDay
      }
    }
  };

  if (time && timeRegex.test(time)) {
    condition['availability.weeklySchedule'].$elemMatch.slots = {
      $elemMatch: {
        start: { $lte: time },
        end: { $gte: time }
      }
    };
  }

  return condition;
};

const findConflictingSession = async (counselorId, scheduledDate, scheduledTime) => {
  const conflict = await Session.exists({
    counselor: counselorId,
    scheduledDate,
    scheduledTime,
    status: { $in: ['requested', 'scheduled', 'in-progress'] }
  });
  return Boolean(conflict);
};

/**
 * Search counselors with filters for patients/admins
 */
export const searchCounselors = async (req, res) => {
  try {
    const {
      specialization,
      language,
      serviceMode,
      district,
      availabilityDay,
      availabilityTime,
      q,
      onlyAvailable,
      limit = 12,
      page = 1
    } = req.query;

    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const filters = [];
    if (specialization) {
      const regex = new RegExp(specialization, 'i');
      filters.push({
        $or: [
          { specialization: regex },
          { specialties: regex }
        ]
      });
    }

    if (q) {
      const searchRegex = new RegExp(q, 'i');
      filters.push({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { bio: searchRegex }
        ]
      });
    }

    if (language) {
      filters.push({
        languages: { $regex: new RegExp(language, 'i') }
      });
    }

    if (district) {
      filters.push({
        district: { $regex: new RegExp(district, 'i') }
      });
    }

    if (serviceMode) {
      filters.push({
        serviceModes: { $in: [serviceMode.toLowerCase()] }
      });
    }

    if (onlyAvailable === 'true') {
      filters.push({ isAvailable: true });
    }

    const availabilityCondition = buildAvailabilityCondition(availabilityDay, availabilityTime);
    if (availabilityCondition) {
      filters.push(availabilityCondition);
    }

    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.role': 'counselor',
          'user.approvalStatus': 'approved',
          'user.isApproved': true
        }
      }
    ];

    if (filters.length) {
      pipeline.push({
        $match: {
          $and: filters
        }
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $sort: { 'rating.average': -1, createdAt: -1 } },
          { $skip: skip },
          { $limit: numericLimit }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    });

    const aggregated = await Profile.aggregate(pipeline);
    const data = aggregated[0]?.data || [];
    const totalResults = aggregated[0]?.totalCount?.[0]?.count || 0;

    if (!data.length) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: numericPage,
          limit: numericLimit,
          total: totalResults,
          totalPages: Math.ceil(totalResults / numericLimit) || 0
        }
      });
    }

    const counselorIds = data.map((profile) => profile.user._id);

    const sessionStats = await Session.aggregate([
      {
        $match: {
          counselor: { $in: counselorIds }
        }
      },
      {
        $group: {
          _id: '$counselor',
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          upcomingSessions: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $in: ['$status', ['scheduled', 'in-progress']] },
                    { $gte: ['$scheduledDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          activePatientsSet: { $addToSet: '$patient' }
        }
      }
    ]);

    const statsMap = mapSessionStats(sessionStats);

    const counselors = data.map((profile) => {
      const counselorId = profile.user._id.toString();
      const stats = statsMap[counselorId] || {
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        activePatients: 0,
        completionRate: 0,
        averageSessionsPerPatient: 0
      };

      return {
        id: counselorId,
        email: profile.user.email,
        fullName: `${profile.firstName} ${profile.lastName}`,
        district: profile.district,
        languages: profile.languages || [],
        serviceModes: profile.serviceModes || [],
        specialties: [...new Set([...(profile.specialization || []), ...(profile.specialties || [])])],
        yearsOfExperience: profile.yearsOfExperience || 0,
        bio: profile.bio || '',
        rating: profile.rating || { average: 0, count: 0 },
        availability: {
          isAvailable: profile.isAvailable,
          timezone: profile.availability?.timezone || 'Africa/Kigali'
        },
        metrics: stats
      };
    });

    res.json({
      success: true,
      data: counselors,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total: totalResults,
        totalPages: Math.ceil(totalResults / numericLimit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching counselors',
      error: error.message
    });
  }
};

/**
 * Get counselor profile and availability details
 */
export const getCounselorDetails = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const profile = await Profile.findOne({ user: counselorId })
      .populate({
        path: 'user',
        select: 'email role approvalStatus isApproved lastActivityAt lastLogin createdAt'
      });

    if (!profile || !profile.user || profile.user.role !== 'counselor') {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    const [sessionSummary, patientList] = await Promise.all([
      Session.aggregate([
        {
          $match: { counselor: profile.user._id }
        },
        {
          $group: {
            _id: '$counselor',
            totalSessions: { $sum: 1 },
            completedSessions: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            upcomingSessions: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $in: ['$status', ['scheduled', 'in-progress']] },
                      { $gte: ['$scheduledDate', new Date()] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            activePatientsSet: { $addToSet: '$patient' }
          }
        }
      ]),
      Session.find({ counselor: profile.user._id })
        .sort({ scheduledDate: -1 })
        .limit(5)
        .populate({
          path: 'patient',
          select: '-password',
          populate: {
            path: 'profile',
            select: 'firstName lastName profilePicture cancerType'
          }
        })
    ]);

    const stats = mapSessionStats(sessionSummary);
    const counselorStats = stats[profile.user._id.toString()] || {
      totalSessions: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      activePatients: 0,
      completionRate: 0,
      averageSessionsPerPatient: 0
    };

    const availableSlots = [];
    const schedule = profile.availability?.weeklySchedule || [];
    const exceptions = profile.availability?.exceptions || [];
    const timezone = profile.availability?.timezone || 'Africa/Kigali';

    if (schedule.length) {
      for (let dayOffset = 0; dayOffset < 14 && availableSlots.length < 8; dayOffset += 1) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + dayOffset);
        const normalizedDate = normalizeDate(date);
        if (!normalizedDate) {
          continue;
        }

        const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
        const weekday = formatter.format(normalizedDate).toLowerCase();
        const daySchedule = schedule.find((entry) => entry.day === weekday);
        if (!daySchedule || !daySchedule.slots || !daySchedule.slots.length) {
          continue;
        }

        const exception = exceptions.find((item) => {
          const exceptionDate = normalizeDate(item.date);
          return exceptionDate && exceptionDate.getTime() === normalizedDate.getTime();
        });

        if (exception && exception.isAvailable === false) {
          continue;
        }

        for (const slot of daySchedule.slots) {
          if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
            continue;
          }
          const conflict = await findConflictingSession(profile.user._id, normalizedDate, slot.start);
          if (!conflict) {
            availableSlots.push({
              date: normalizedDate.toISOString(),
              start: slot.start,
              end: slot.end,
              isVirtual: slot.isVirtual !== undefined ? Boolean(slot.isVirtual) : true
            });
          }
          if (availableSlots.length >= 8) {
            break;
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        id: profile.user._id,
        email: profile.user.email,
        fullName: `${profile.firstName} ${profile.lastName}`,
        district: profile.district,
        bio: profile.bio || '',
        languages: profile.languages || [],
        serviceModes: profile.serviceModes || [],
        specialties: [...new Set([...(profile.specialization || []), ...(profile.specialties || [])])],
        qualifications: profile.qualifications || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        rating: profile.rating || { average: 0, count: 0 },
        availability: {
          isAvailable: profile.isAvailable,
          timezone,
          weeklySchedule: schedule,
          exceptions,
          upcomingSlots: availableSlots
        },
        metrics: counselorStats,
        recentPatients: patientList
          .filter((session) => session.patient)
          .map((session) => ({
            sessionId: session._id,
            scheduledDate: session.scheduledDate,
            status: session.status,
            patient: session.patient
          }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching counselor details',
      error: error.message
    });
  }
};

/**
 * Get counselor availability snapshot
 */
export const getCounselorAvailability = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const profile = await Profile.findOne({ user: counselorId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Counselor not found'
      });
    }

    res.json({
      success: true,
      data: {
        isAvailable: profile.isAvailable,
        availability: profile.availability,
        serviceModes: profile.serviceModes || [],
        languages: profile.languages || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
};

/**
 * Update counselor availability and service preferences
 */
export const updateCounselorAvailability = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const {
      availability,
      isAvailable,
      serviceModes,
      specialties,
      specialization,
      languages,
      bio
    } = req.body;

    const profile = await Profile.findOne({ user: counselorId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (typeof isAvailable === 'boolean') {
      profile.isAvailable = isAvailable;
    }

    if (availability) {
      const {
        weeklySchedule,
        exceptions,
        timezone,
        maxSessionsPerDay
      } = availability;

      if (weeklySchedule) {
        if (!validateWeeklySchedule(weeklySchedule)) {
          return res.status(400).json({
            success: false,
            message: 'Weekly schedule is invalid'
          });
        }
        profile.availability.weeklySchedule = formatWeeklySchedule(weeklySchedule);
      }

      if (Array.isArray(exceptions)) {
        profile.availability.exceptions = exceptions
          .map((item) => {
            const exceptionDate = normalizeDate(item.date);
            if (!exceptionDate) {
              return null;
            }
            return {
              date: exceptionDate,
              isAvailable: item.isAvailable !== false,
              reason: item.reason || ''
            };
          })
          .filter(Boolean);
      }

      if (timezone) {
        profile.availability.timezone = timezone;
      }

      if (typeof maxSessionsPerDay === 'number' && maxSessionsPerDay > 0) {
        profile.availability.maxSessionsPerDay = maxSessionsPerDay;
      }
    }

    if (Array.isArray(specialties)) {
      profile.specialties = sanitizeStringsArray(specialties);
    }

    if (Array.isArray(specialization)) {
      profile.specialization = sanitizeStringsArray(specialization);
    }

    if (Array.isArray(languages)) {
      profile.languages = sanitizeStringsArray(languages);
    }

    if (Array.isArray(serviceModes)) {
      profile.serviceModes = sanitizeServiceModes(serviceModes);
    }

    if (typeof bio === 'string') {
      profile.bio = bio.trim();
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating counselor availability',
      error: error.message
    });
  }
};

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

