// routes/userRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUser } from '../middleware/validationMiddleware.js';
import logger from '../utils/logger.js';
import UserModel from '../models/user.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Log all incoming requests
router.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
});

// Register a new user
router.post('/register', validateUser, async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    logger.error('Error in /register route', { error });
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  const sequelize = req.app.get('sequelize');
  const User = UserModel(sequelize);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      logger.warn('Login failed: Missing credentials');
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      logger.warn('Login failed: User not found', { username });
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    if (!user.isActive) {
      logger.warn('Login failed: User inactive', { username });
      return res.status(403).json({ message: 'Your account is not active. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed: Incorrect password', { username });
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isActive: user.isActive
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info('Login successful', {
      userId: user.id,
      username: user.username,
      role: user.role
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    logger.error('Login error', { error });
    res.status(500).json({ message: 'An unexpected error occurred during login.' });
    next(error);
  }
});

// Protected profile route
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    await getUserProfile(req, res);
  } catch (error) {
    logger.error('Error in /profile route', { error });
    next(error);
  }
});

export default router;