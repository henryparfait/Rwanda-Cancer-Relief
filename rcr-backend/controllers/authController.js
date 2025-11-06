// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { uploadImage, uploadDocument } from '../utils/cloudinary.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user (patient or counselor)
export const register = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, confirmPassword,
      gender, dob, district, telephone, cancerType, role
    } = req.body;

    // prevent admin registration via this route
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is not allowed'
      });
    }

    // 1) Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // 2) Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // 3) Create user (BOTH need approval)
    const newUser = await User.create({
      email,
      password,
      role: role || 'patient',
      isApproved: false,
      approvalStatus: 'pending'
    });

    // 4) Handle file uploads
    let profilePictureUrl = '';
    let cvUrl = '';
    let medicalLicenseUrl = '';

    if (req.files) {
      try {
        if (req.files.profilePic && req.files.profilePic[0]) {
          const uploadResult = await uploadImage(
            req.files.profilePic[0].buffer,
            'rcr/profiles',
            { width: 400, height: 400, crop: 'fill' }
          );
          profilePictureUrl = uploadResult.secure_url;
        }

        if (role === 'counselor') {
          if (req.files.cv && req.files.cv[0]) {
            const uploadResult = await uploadDocument(
              req.files.cv[0].buffer,
              'rcr/documents/cv'
            );
            cvUrl = uploadResult.secure_url;
          }

          if (req.files.medicalLicense && req.files.medicalLicense[0]) {
            const uploadResult = await uploadDocument(
              req.files.medicalLicense[0].buffer,
              'rcr/documents/licenses'
            );
            medicalLicenseUrl = uploadResult.secure_url;
          }
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
      }
    }

    // 5) Create profile
    const normalizedGender = gender?.toLowerCase();
    const profileData = {
      user: newUser._id,
      firstName,
      lastName,
      gender: normalizedGender,
      dateOfBirth: dob,
      district,
      telephone,
      applicationDate: new Date()
    };

    if (profilePictureUrl) {
      profileData.profilePicture = profilePictureUrl;
    }

    if (role === 'patient') {
      profileData.cancerType = cancerType || '';
    } else if (role === 'counselor') {
      if (cvUrl) profileData.cv = cvUrl;
      if (medicalLicenseUrl) profileData.medicalLicense = medicalLicenseUrl;
    }

    const newProfile = await Profile.create(profileData);

    // 5) Generate JWT token
    const token = signToken(newUser._id);

    // 6) Send response
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Your account is pending admin approval. You will be notified once approved.',
      token,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          isApproved: newUser.isApproved,
          approvalStatus: newUser.approvalStatus
        },
        profile: newProfile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message
    });
  }
};

// Login for all users
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // Update login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // check approval status for non-admin users
    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for approval before logging in.'
      });
    }

    // Get additional data based on role
    let additionalData = {};

    if (user.role === 'admin') {
      // For admins, we already have name in User model
      additionalData = {
        fullName: user.fullName,
        position: user.position
      };
    } else {
      // For patients and counselors, fetch profile info
      const profile = await Profile.findOne({ user: user._id });
      additionalData = {
        profile
      };
    }

    // Generate token and send response
    const token = signToken(user._id);

    // Send appropriate response based on role
    let loginMessage = 'Logged in successfully';
    if (user.role === 'admin') {
      loginMessage = 'Admin log in successfully';
    }

    // Send response
    res.status(200).json({
      success: true,
      message: loginMessage,
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus,
          ...(user.role === 'admin' && {
            fullName: user.fullName,
            position: user.position
          })
        },
        ...additionalData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let additionalData = {};

    if (user.role === 'admin') {
      additionalData = {
        fullName: user.fullName,
        position: user.position
      };
    } else {
      const profile = await Profile.findOne({ user: user._id });
      additionalData = {
        profile
      };
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus,
          ...(user.role === 'admin' && {
            fullName: user.fullName,
            position: user.position
          })
        },
        ...additionalData
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
};
