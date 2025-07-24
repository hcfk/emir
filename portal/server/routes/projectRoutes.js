// routes/projectRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import ProjectModel from '../models/project.js';
import UserModel from '../models/user.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Create a new project
router.post('/', authMiddleware, async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const Project = ProjectModel(sequelize);

  try {
    const { name, description } = req.body;
    const creatorId = req.user.id;

    const newProject = await Project.create({
      name,
      description,
      creator: creatorId,
      members: [{ userId: creatorId, role: 'projectadmin' }]
    });

    logger.info('Project created', { projectId: newProject.id, creatorId });
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    logger.error('Error creating project', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'An error occurred while creating the project' });
  }
});

// Get all projects user is part of
router.get('/', authMiddleware, async (req, res) => {
  const sequelize = req.app.get('sequelize');
  const Project = ProjectModel(sequelize);

  try {
    const userId = req.user.id;
    const projects = await Project.findAll({
      where: sequelize.literal(`'${userId}' = ANY (SELECT member->>'userId' FROM jsonb_array_elements("members"))`)
    });
    res.json({ projects });
  } catch (error) {
    logger.error('Error fetching projects', { error: error.message });
    res.status(500).json({ message: 'An error occurred while fetching projects' });
  }
});

// More routes (GET /:id, PUT /:id, DELETE /:id, /:id/invite, etc.) need refactoring to match Sequelize structure
// Currently skipped due to complexity around JSONB `members` field in PostgreSQL

export default router;
