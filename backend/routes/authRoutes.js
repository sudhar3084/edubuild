import express from 'express';
import { signup, signin, getProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', auth, getProfile);

export default router;
