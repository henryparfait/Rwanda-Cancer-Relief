// controllers/adminController.js
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Get all pending approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      approvalStatus: 'pending',
      role: { $in: ['patient', 'counselor'] }
    }).populate('profile');

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending approvals',
      error: error.message
    });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvedBy = adminId;
    user.approvedAt = new Date();

    await user.save();

    const profile = await Profile.findOne({ user: user._id });

    res.json({
      success: true,
      message: `User ${user.role} approved successfully`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus,
          approvedAt: user.approvedAt
        },
        profile
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message
    });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isApproved = false;
    user.approvalStatus = 'rejected';
    user.rejectionReason = rejectionReason || 'No reason provided';

    await user.save();

    res.json({
      success: true,
      message: 'User application rejected',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus,
          rejectionReason: user.rejectionReason
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message
    });
  }
};

// Get all users with approval status
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['patient', 'counselor'] }
    })
      .populate('profile')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};