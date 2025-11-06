import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as resourceController from '../controllers/resourceController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', resourceController.getResources);
router.get('/:resourceId', resourceController.getResource);
router.get('/:resourceId/download', resourceController.downloadResource);

router.use(protect);
router.use(authorize('counselor', 'admin'));

router.post('/', upload.single('file'), resourceController.createResource);
router.put('/:resourceId', resourceController.updateResource);
router.delete('/:resourceId', resourceController.deleteResource);

export default router;

