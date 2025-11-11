import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.use(protect);

// Counselor session management
router.get('/', authorize('counselor'), sessionController.getSessions);
router.get('/counselor', authorize('counselor'), sessionController.getSessions);
router.get('/counselor/:sessionId', authorize('counselor'), sessionController.getSession);
router.get('/:sessionId', authorize('counselor'), sessionController.getSession);
router.post('/', authorize('counselor'), sessionController.createSession);
router.post('/counselor', authorize('counselor'), sessionController.createSession);
router.put('/requests/:sessionId/respond', authorize('counselor'), sessionController.respondToSessionRequest);
router.put('/:sessionId', authorize('counselor'), sessionController.updateSession);
router.put('/:sessionId/reschedule', authorize('counselor'), sessionController.rescheduleSession);
router.put('/:sessionId/cancel', authorize('counselor'), sessionController.cancelSession);
router.put('/:sessionId/start', authorize('counselor'), sessionController.startSession);

// Patient session management
router.get('/patient', authorize('patient'), sessionController.getPatientSessions);
router.get('/patient/:sessionId', authorize('patient'), sessionController.getPatientSession);
router.post('/patient/request', authorize('patient'), sessionController.requestSession);
router.put('/patient/:sessionId/cancel', authorize('patient'), sessionController.cancelSessionByPatient);

export default router;

