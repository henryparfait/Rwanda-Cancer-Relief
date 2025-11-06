import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as counselorController from '../controllers/counselorController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('counselor'));

router.get('/dashboard/stats', counselorController.getDashboardStats);
router.get('/patients', counselorController.getMyPatients);
router.get('/patients/:patientId', counselorController.getPatientProfile);

export default router;

