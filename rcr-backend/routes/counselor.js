import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as counselorController from '../controllers/counselorController.js';

const router = express.Router();

router.use(protect);

// Directory and discovery endpoints (patients, counselors, admins)
router.get(
  '/directory',
  authorize('patient', 'counselor', 'admin'),
  counselorController.searchCounselors
);

router.get(
  '/directory/:counselorId',
  authorize('patient', 'counselor', 'admin'),
  counselorController.getCounselorDetails
);

router.get(
  '/directory/:counselorId/availability',
  authorize('patient', 'counselor', 'admin'),
  counselorController.getCounselorAvailability
);

// Counselor-managed endpoints
router.use(authorize('counselor'));

router.get('/dashboard/stats', counselorController.getDashboardStats);
router.get('/patients', counselorController.getMyPatients);
router.get('/patients/:patientId', counselorController.getPatientProfile);
router.put('/profile/availability', counselorController.updateCounselorAvailability);

export default router;

