import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as communityController from '../controllers/communityController.js';

const router = express.Router();

router.use(protect);

router.get(
  '/',
  authorize('patient', 'counselor', 'admin'),
  communityController.listPosts
);

router.post(
  '/',
  authorize('patient', 'counselor', 'admin'),
  communityController.createPost
);

router.post(
  '/:postId/reactions',
  authorize('patient', 'counselor', 'admin'),
  communityController.reactToPost
);

router.get(
  '/:postId/comments',
  authorize('patient', 'counselor', 'admin'),
  communityController.getComments
);

router.post(
  '/:postId/comments',
  authorize('patient', 'counselor', 'admin'),
  communityController.createComment
);

router.delete(
  '/:postId',
  authorize('patient', 'counselor', 'admin'),
  communityController.deletePost
);

router.delete(
  '/comments/:commentId',
  authorize('patient', 'counselor', 'admin'),
  communityController.deleteComment
);

router.put(
  '/:postId/pin',
  authorize('admin'),
  communityController.togglePinPost
);

export default router;

