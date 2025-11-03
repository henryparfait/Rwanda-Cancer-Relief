import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// Public routes
router.post(
  '/register', 
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'medicalLicense', maxCount: 1 }
  ]), 
  register
);
router.post('/login', login);

// Protected route (requires token)
router.get('/me', protect, getMe);

router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});


export default router;