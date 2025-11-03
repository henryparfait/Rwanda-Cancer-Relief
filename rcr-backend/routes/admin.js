// routes/admin.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
import * as adminDashboardController from '../controllers/adminDashboardController.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));


// Dashboard Routes
router.get('/dashboard/stats', adminDashboardController.getDashboardStats);
router.get('/dashboard/activity', adminDashboardController.getRecentActivity);
router.get('/dashboard/analytics', adminDashboardController.getUserAnalytics);


// User Management Routes
router.get('/pending-approvals', adminController.getPendingApprovals);
router.get('/users', adminController.getAllUsers);
router.put('/approve/:userId', adminController.approveUser);
router.put('/reject/:userId', adminController.rejectUser);


// Admin Management Routes
router.post('/create-admin', adminController.createAdmin);

export default router;