// routes/admin.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPendingApprovals,
  getAllUsers,
  approveUser,
  rejectUser
} from '../controllers/adminController.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/pending-approvals
// @desc    Get all pending user approvals
// @access  Private/Admin
router.get('/pending-approvals', getPendingApprovals);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', getAllUsers);

// @route   PUT /api/admin/approve/:userId
// @desc    Approve a user
// @access  Private/Admin
router.put('/approve/:userId', approveUser);

// @route   PUT /api/admin/reject/:userId
// @desc    Reject a user
// @access  Private/Admin
router.put('/reject/:userId', rejectUser);

export default router;