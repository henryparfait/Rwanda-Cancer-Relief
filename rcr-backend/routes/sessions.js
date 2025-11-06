import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('counselor'));

router.get('/', sessionController.getSessions);
router.get('/:sessionId', sessionController.getSession);
router.post('/', sessionController.createSession);
router.put('/:sessionId', sessionController.updateSession);
router.put('/:sessionId/reschedule', sessionController.rescheduleSession);
router.put('/:sessionId/cancel', sessionController.cancelSession);
router.put('/:sessionId/start', sessionController.startSession);

export default router;

