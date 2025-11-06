import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as templateController from '../controllers/sessionNotesTemplateController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('counselor', 'admin'));

router.get('/', templateController.getTemplates);
router.get('/:templateId', templateController.getTemplate);
router.post('/', templateController.createTemplate);
router.put('/:templateId', templateController.updateTemplate);
router.delete('/:templateId', templateController.deleteTemplate);

export default router;

