import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('counselor'));

router.get('/conversations', messageController.getConversations);
router.get('/conversations/:patientId', messageController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/send', messageController.sendMessage);
router.put('/conversations/:conversationId/read', messageController.markMessagesAsRead);

export default router;

