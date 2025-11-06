import User from '../models/User.js';
import Profile from '../models/Profile.js';
import bcrypt from 'bcryptjs';
import { uploadImage, extractPublicId, deleteFromCloudinary } from '../utils/cloudinary.js';

/**
 * Update counselor profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      bio,
      specialization,
      yearsOfExperience,
      qualifications,
      profilePicture,
      telephone
    } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    let profilePictureUrl = profilePicture;

    if (req.file) {
      try {
        const oldPublicId = extractPublicId(profile.profilePicture);
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId).catch(() => {});
        }

        const uploadResult = await uploadImage(
          req.file.buffer,
          'rcr/profiles',
          { width: 400, height: 400, crop: 'fill' }
        );
        profilePictureUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading profile picture',
          error: uploadError.message
        });
      }
    }

    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (bio !== undefined) profile.bio = bio;
    if (specialization) profile.specialization = Array.isArray(specialization) ? specialization : [specialization];
    if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
    if (qualifications) profile.qualifications = qualifications;
    if (profilePictureUrl) profile.profilePicture = profilePictureUrl;
    if (telephone) profile.telephone = telephone;

    await profile.save();

    const updatedProfile = await Profile.findOne({ user: userId })
      .populate('user', '-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * Update availability status
 */
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable must be a boolean value'
      });
    }

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.isAvailable = isAvailable;
    await profile.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        isAvailable: profile.isAvailable
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, sms, message } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (!profile.notificationPreferences) {
      profile.notificationPreferences = {
        email: true,
        sms: false,
        message: true
      };
    }

    if (typeof email === 'boolean') {
      profile.notificationPreferences.email = email;
    }
    if (typeof sms === 'boolean') {
      profile.notificationPreferences.sms = sms;
    }
    if (typeof message === 'boolean') {
      profile.notificationPreferences.message = message;
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: {
        notificationPreferences: profile.notificationPreferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification preferences',
      error: error.message
    });
  }
};

/**
 * Update password
 */
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirmation are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordCorrect = await user.correctPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};

/**
 * Update contact information
 */
export const updateContactInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, telephone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email;
      await user.save();
    }

    if (telephone) {
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        profile.telephone = telephone;
        await profile.save();
      }
    }

    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('profile');

    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact information',
      error: error.message
    });
  }
};

