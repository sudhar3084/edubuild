import Feedback from '../models/Feedback.js';
import Project from '../models/Project.js';
import { Op } from 'sequelize';

export const submitFeedback = async (req, res) => {
  try {
    const { projectId, difficulty, feedback, rating } = req.body;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newFeedback = await Feedback.create({
      projectId,
      userId: req.userId,
      userName: req.body.userName,
      schoolName: req.body.schoolName,
      difficulty,
      feedback,
      rating,
    });

    // Update project rating
    const allFeedbacks = await Feedback.findAll({ where: { projectId } });
    const avgRating = allFeedbacks.length > 0
      ? allFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / allFeedbacks.length
      : 0;
    
    await project.update({ rating: avgRating });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
  }
};

export const getProjectFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { projectId: req.params.projectId },
      order: [['createdAt', 'DESC']],
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
  }
};
