// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user (patient or counselor) - BOTH need approval
export const register = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, confirmPassword,
      gender, dob, district, telephone, cancerType, role
    } = req.body;

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

    // 4) Create profile
    const profileData = {
      user: newUser._id,
      firstName,
      lastName,
      gender,
      dateOfBirth: dob,
      district,
      telephone,
      applicationDate: new Date()
    };

    if (role === 'patient') {
      profileData.cancerType = cancerType || '';
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

// Login user - Check approval status
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for approval before logging in.'
      });
    }

    const profile = await Profile.findOne({ user: user._id });
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus
        },
        profile
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