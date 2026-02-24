import express from 'express';
import { explainProject, chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

router.post('/explain', explainProject);
router.post('/chat', chatWithAI);

export default router;
