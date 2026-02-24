import express from 'express';
import { submitFeedback, getProjectFeedback } from '../controllers/feedbackController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, submitFeedback);
router.get('/:projectId', getProjectFeedback);

export default router;
