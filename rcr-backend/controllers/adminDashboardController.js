import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPatients,
      totalCounselors,
      pendingApprovals,
      approvedUsers,
      rejectedUsers
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['patient', 'counselor'] } }),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'counselor' }),
      User.countDocuments({ approvalStatus: 'pending' }),
      User.countDocuments({ approvalStatus: 'approved' }),
      User.countDocuments({ approvalStatus: 'rejected' })
    ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
      role: { $in: ['patient', 'counselor'] }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPatients,
          totalCounselors,
          pendingApprovals,
          approvedUsers,
          rejectedUsers,
          recentRegistrations
        },
        approvalRate: totalUsers > 0 ? Math.round((approvedUsers / totalUsers) * 100) : 0,
        pendingUrgency:
          pendingApprovals > 10 ? 'high' :
          pendingApprovals > 5 ? 'medium' : 'low'
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

// Get recent activity (pending approvals and recent registrations)
export const getRecentActivity = async (req, res) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' })
      .populate('profile')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentApprovals = await User.find({
      approvalStatus: 'approved',
      approvedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .populate('profile')
      .select('-password')
      .sort({ approvedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        pendingApprovals: pendingUsers,
        recentApprovals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};

// Get user analytics for charts
export const getUserAnalytics = async (req, res) => {
  try {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      last6Months.push(date.toISOString().slice(0, 7)); // YYYY-MM
    }

    const registrationStats = await Promise.all(
      last6Months.map(async (month) => {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const [patients, counselors] = await Promise.all([
          User.countDocuments({ role: 'patient', createdAt: { $gte: startDate, $lt: endDate } }),
          User.countDocuments({ role: 'counselor', createdAt: { $gte: startDate, $lt: endDate } })
        ]);

        return {
          month: startDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
          patients,
          counselors,
          total: patients + counselors
        };
      })
    );

    const approvalStats = await User.aggregate([
      { $match: { role: { $in: ['patient', 'counselor'] } } },
      { $group: { _id: '$approvalStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        registrationTrends: registrationStats,
        approvalDistribution: approvalStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};