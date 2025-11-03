// controllers/adminController.js
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// Get all pending approvals
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingProfiles = await Profile.find().populate({
      path: 'user',
      match: {
        approvalStatus: 'pending',
        role: { $in: ['patient', 'counselor'] }
      },
      select: '-password'
    });

    // Filter out profiles where user is null 
    const filtered = pendingProfiles.filter(p => p.user);

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
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

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve an admin user'
      });
    }

    if (user.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    // update user approval status
    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvedBy = adminId;
    user.approvedAt = new Date();

    await user.save();

    // get user profile for response
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

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin user'
      });
    }

    // update user rejection status
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
    const profiles = await Profile.find().populate({
      path: 'user',
      match: {
        role: { $in: ['patient', 'counselor'] }
      },
      select: '-password'
    });

    const filtered = profiles.filter(p => p.user);

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Create new admin by existing admins
export const createAdmin = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // check if user already exists
    const extinguingUser = await User.findOne({ email });
    if (extinguingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // create new admin user
    const newUser = await User.create({
      email,
      password,
      role: 'admin',
      fullName,
      position: position || 'System Administrator',
      isApproved: true,
      approvalStatus: 'approved'
    });
  
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully', 
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          fullName: newUser.fullName,
          position: newUser.position,
        }
      }
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
};