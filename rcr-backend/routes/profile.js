import express from 'express';
import { protect } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(protect);

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authController.getMe);

export default router;