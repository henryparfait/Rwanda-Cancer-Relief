import User from '../models/User.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';

const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;

const createDateNDaysAgo = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

const initializeDailySeries = (days) => {
  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = createDateNDaysAgo(i);
    series.push({
      date: date.toISOString().split('T')[0],
      count: 0
    });
  }
  return series;
};

const mergeCountsIntoSeries = (series, aggregated) => {
  const indexMap = new Map(series.map((entry, index) => [entry.date, index]));
  aggregated.forEach((item) => {
    const dateKey = item._id;
    const index = indexMap.get(dateKey);
    if (index !== undefined) {
      series[index].count = item.count;
    }
  });
  return series;
};

const aggregateDailyCounts = async (Model, match, dateField, days) => {
  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: `$${dateField}`
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const aggregated = await Model.aggregate(pipeline);
  return mergeCountsIntoSeries(initializeDailySeries(days), aggregated);
};

const transformGroupByRole = (groups, roles) => {
  const result = roles.reduce((acc, role) => ({ ...acc, [role]: 0 }), {});
  groups.forEach((group) => {
    if (group._id && result[group._id] !== undefined) {
      result[group._id] = group.count;
    }
  });
  return result;
};

export const getSystemOverview = async (req, res) => {
  try {
    const now = new Date();
    const lastSevenDays = createDateNDaysAgo(DAYS_IN_WEEK - 1);
    const lastThirtyDays = createDateNDaysAgo(DAYS_IN_MONTH - 1);

    const [
      totalPatients,
      totalCounselors,
      pendingApprovals,
      sessionsByStatus,
      sessionTrend,
      messageTrend,
      activePatientsIds,
      activeCounselorsIds,
      messagesLastSevenDays,
      sessionsLastSevenDays,
      newPatientsLastSevenDays,
      newCounselorsLastSevenDays
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'counselor' }),
      User.countDocuments({ approvalStatus: 'pending' }),
      Session.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      aggregateDailyCounts(
        Session,
        { scheduledDate: { $gte: lastSevenDays } },
        'scheduledDate',
        DAYS_IN_WEEK
      ),
      aggregateDailyCounts(
        Message,
        { createdAt: { $gte: lastSevenDays } },
        'createdAt',
        DAYS_IN_WEEK
      ),
      Session.distinct('patient', { scheduledDate: { $gte: lastThirtyDays } }),
      Session.distinct('counselor', { scheduledDate: { $gte: lastThirtyDays } }),
      Message.countDocuments({ createdAt: { $gte: lastSevenDays } }),
      Session.countDocuments({ scheduledDate: { $gte: lastSevenDays } }),
      User.countDocuments({ role: 'patient', createdAt: { $gte: lastSevenDays } }),
      User.countDocuments({ role: 'counselor', createdAt: { $gte: lastSevenDays } })
    ]);

    const activeSessions = await Session.countDocuments({
      status: { $in: ['scheduled', 'in-progress'] },
      scheduledDate: { $gte: now }
    });

    const sessionStatus = sessionsByStatus.reduce((acc, item) => ({
      ...acc,
      [item._id]: item.count
    }), {});

    res.json({
      success: true,
      data: {
        users: {
          totalPatients,
          totalCounselors,
          pendingApprovals,
          newPatientsLastSevenDays,
          newCounselorsLastSevenDays,
          activePatients: activePatientsIds.length,
          activeCounselors: activeCounselorsIds.length
        },
        sessions: {
          total: Object.values(sessionStatus).reduce((total, count) => total + count, 0),
          activeSessions,
          byStatus: sessionStatus,
          lastSevenDays: sessionTrend
        },
        messages: {
          lastSevenDays: messageTrend,
          totalLastSevenDays: messagesLastSevenDays
        },
        activity: {
          sessionsLastSevenDays,
          messagesLastSevenDays
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching system overview analytics',
      error: error.message
    });
  }
};

export const getSessionAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = createDateNDaysAgo(DAYS_IN_WEEK - 1);
    const upcomingWindow = new Date();
    upcomingWindow.setDate(upcomingWindow.getDate() + 7);

    const [
      totalSessions,
      completedSessions,
      cancelledSessions,
      averageDuration,
      upcomingSessions,
      sessionsPerDay,
      topCounselors
    ] = await Promise.all([
      Session.countDocuments(),
      Session.countDocuments({ status: 'completed' }),
      Session.countDocuments({ status: 'cancelled' }),
      Session.aggregate([
        {
          $group: {
            _id: null,
            averageDuration: { $avg: '$duration' }
          }
        }
      ]),
      Session.countDocuments({
        status: { $in: ['scheduled', 'in-progress'] },
        scheduledDate: { $gte: now, $lte: upcomingWindow }
      }),
      aggregateDailyCounts(
        Session,
        { scheduledDate: { $gte: startOfWeek } },
        'scheduledDate',
        DAYS_IN_WEEK
      ),
      Session.aggregate([
        {
          $match: { status: 'completed' }
        },
        {
          $group: {
            _id: '$counselor',
            completedCount: { $sum: 1 },
            averageDuration: { $avg: '$duration' }
          }
        },
        { $sort: { completedCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'counselor'
          }
        },
        { $unwind: '$counselor' },
        {
          $project: {
            _id: 0,
            counselorId: '$counselor._id',
            counselorEmail: '$counselor.email',
            role: '$counselor.role',
            completedCount: 1,
            averageDuration: 1
          }
        }
      ])
    ]);

    const completionRate = totalSessions > 0
      ? Number(((completedSessions / totalSessions) * 100).toFixed(1))
      : 0;
    const cancellationRate = totalSessions > 0
      ? Number(((cancelledSessions / totalSessions) * 100).toFixed(1))
      : 0;

    res.json({
      success: true,
      data: {
        totals: {
          totalSessions,
          completedSessions,
          cancelledSessions,
          completionRate,
          cancellationRate,
          averageDuration: averageDuration[0]?.averageDuration || 0,
          upcomingSessions
        },
        lastSevenDays: sessionsPerDay,
        topCounselors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session analytics',
      error: error.message
    });
  }
};

export const getMessageAnalytics = async (req, res) => {
  try {
    const lastSevenDays = createDateNDaysAgo(DAYS_IN_WEEK - 1);

    const [
      totalMessages,
      unreadMessages,
      messageTypes,
      messageTrend,
      unreadBreakdown
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.aggregate([
        {
          $group: {
            _id: '$messageType',
            count: { $sum: 1 }
          }
        }
      ]),
      aggregateDailyCounts(
        Message,
        { createdAt: { $gte: lastSevenDays } },
        'createdAt',
        DAYS_IN_WEEK
      ),
      Message.aggregate([
        { $match: { isRead: false } },
        {
          $lookup: {
            from: 'users',
            localField: 'receiver',
            foreignField: '_id',
            as: 'receiver'
          }
        },
        { $unwind: '$receiver' },
        {
          $group: {
            _id: '$receiver.role',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          totalMessages,
          unreadMessages,
          unreadByRole: transformGroupByRole(unreadBreakdown, ['patient', 'counselor', 'admin'])
        },
        types: messageTypes.reduce((acc, item) => ({
          ...acc,
          [item._id || 'unknown']: item.count
        }), {}),
        lastSevenDays: messageTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching message analytics',
      error: error.message
    });
  }
};

export const getPatientEngagement = async (req, res) => {
  try {
    const lastThirtyDays = createDateNDaysAgo(DAYS_IN_MONTH - 1);
    const approvedPatientsMatch = { role: 'patient', approvalStatus: 'approved' };

    const [
      totalApprovedPatients,
      totalSessions,
      patientsWithSessions,
      returningPatients,
      inactivePatients
    ] = await Promise.all([
      User.countDocuments(approvedPatientsMatch),
      Session.countDocuments({ status: { $ne: 'cancelled' } }),
      Session.aggregate([
        {
          $group: {
            _id: '$patient',
            sessions: { $sum: 1 }
          }
        }
      ]),
      Session.aggregate([
        {
          $match: {
            scheduledDate: { $gte: lastThirtyDays },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: '$patient',
            sessions: { $sum: 1 }
          }
        },
        { $match: { sessions: { $gte: 2 } } },
        { $count: 'count' }
      ]),
      User.countDocuments({
        role: 'patient',
        approvalStatus: 'approved',
        lastLogin: { $lt: lastThirtyDays }
      })
    ]);

    const patientMap = patientsWithSessions.reduce((acc, item) => {
      if (item._id) {
        acc[item._id.toString()] = item.sessions;
      }
      return acc;
    }, {});

    const patientsWithCounselorCount = Object.keys(patientMap).length;
    const patientsWithoutCounselor = Math.max(
      totalApprovedPatients - patientsWithCounselorCount,
      0
    );

    const averageSessionsPerPatient = patientsWithCounselorCount > 0
      ? Number((totalSessions / patientsWithCounselorCount).toFixed(1))
      : 0;

    res.json({
      success: true,
      data: {
        totals: {
          totalApprovedPatients,
          patientsWithCounselor: patientsWithCounselorCount,
          patientsWithoutCounselor,
          inactivePatients
        },
        engagement: {
          averageSessionsPerPatient,
          returningPatients: returningPatients[0]?.count || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient engagement analytics',
      error: error.message
    });
  }
};

