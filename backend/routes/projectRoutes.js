import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  approveProject,
  deleteProject,
} from '../controllers/projectController.js';
import optionalAuth from '../middleware/optionalAuth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllProjects);
router.get('/:id', optionalAuth, getProjectById);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.patch('/:id/status', auth, approveProject);
router.delete('/:id', auth, deleteProject);

export default router;
