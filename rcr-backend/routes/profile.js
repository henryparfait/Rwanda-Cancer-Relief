import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as profileController from '../controllers/profileController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply authentication middleware to all profile routes
router.use(protect);

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authController.getMe);

/**
 * @route   PUT /api/profile/update
 * @desc    Update counselor profile
 * @access  Private (Counselor only)
 */
router.put('/update', authorize('counselor'), upload.single('profilePicture'), profileController.updateProfile);

/**
 * @route   PUT /api/profile/availability
 * @desc    Update availability status
 * @access  Private (Counselor only)
 */
router.put('/availability', authorize('counselor'), profileController.updateAvailability);

/**
 * @route   PUT /api/profile/notifications
 * @desc    Update notification preferences
 * @access  Private (Counselor only)
 */
router.put('/notifications', authorize('counselor'), profileController.updateNotificationPreferences);

/**
 * @route   PUT /api/profile/password
 * @desc    Update password
 * @access  Private
 */
router.put('/password', profileController.updatePassword);

/**
 * @route   PUT /api/profile/contact
 * @desc    Update contact information
 * @access  Private
 */
router.put('/contact', profileController.updateContactInfo);

export default router;