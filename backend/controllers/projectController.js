import Project from '../models/Project.js';
import { Op } from 'sequelize';

export const getAllProjects = async (req, res) => {
  try {
    const { budget, classLevel, subject } = req.query;

    // Build filter
    const where = {};
    if (budget) where.budget = { [Op.lte]: parseInt(budget) };
    if (classLevel) where.classLevel = classLevel;
    if (subject) where.subject = subject;

    // Only admins see all projects, others see only approved
    if (req.userRole !== 'admin') {
      where.status = 'approved';
    }

    const projects = await Project.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Protect non-approved projects unless admin or creator
    if (project.status !== 'approved' && req.userRole !== 'admin' && project.createdBy !== req.userId) {
      return res.status(403).json({ message: 'Project is pending approval' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, budget, classLevel, subject, materials, steps, learningOutcomes, difficulty, image, videoUrl } = req.body;

    console.log('📹 Creating project with videoUrl:', videoUrl);

    // Admins' projects are automatically approved
    const status = req.userRole === 'admin' ? 'approved' : 'pending';

    const project = await Project.create({
      title,
      description,
      budget,
      classLevel,
      subject,
      materials,
      steps,
      learningOutcomes,
      difficulty,
      image,
      videoUrl,
      createdBy: req.userId,
      status
    });

    console.log('✅ Project created, videoUrl in DB:', project.videoUrl);

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    console.log('📹 Updating project, videoUrl in body:', req.body.videoUrl);

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only creator or admin can update
    if (project.createdBy !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    await project.update(req.body);

    console.log('✅ Project updated, new videoUrl:', project.videoUrl);

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

export const approveProject = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve projects' });
    }

    const { status } = req.body; // 'approved' or 'rejected'
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ status });
    res.json({ message: `Project ${status} successfully`, project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project status', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    console.log('🗑️ Delete request for project:', req.params.id);
    console.log('   User ID:', req.userId);
    console.log('   User Role:', req.userRole);

    const project = await Project.findByPk(req.params.id);

    if (!project) {
      console.log('❌ Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('   Project Creator:', project.createdBy);

    // Admin can delete anything, creator can delete their own
    const isAdmin = req.userRole === 'admin';
    const isCreator = project.createdBy === req.userId;

    if (!isAdmin && !isCreator) {
      console.log('❌ Not authorized - user is neither admin nor creator');
      return res.status(403).json({
        message: 'Not authorized to delete this project',
        debug: {
          userRole: req.userRole,
          userId: req.userId,
          createdBy: project.createdBy
        }
      });
    }

    console.log('✅ Authorization passed - deleting project');
    await project.destroy();
    console.log('✅ Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};
