// middleware/authMiddleware.js

import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    logger.warn('Authorization attempt without token', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
    })
    return res.status(401).json({ message: 'No token provided, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.role || decoded.isActive === undefined) {
      logger.warn('Token missing role or isActive status', {
        userId: decoded.id,
        ip: req.ip,
        url: req.originalUrl,
      })
      return res.status(403).json({ message: 'Invalid token structure' })
    }

    if (!decoded.isActive) {
      logger.warn('Access attempt by inactive user', { userId: decoded.id })
      return res.status(403).json({ message: 'Your account is inactive. Please contact support.' })
    }

    // Project-level role check (for future use)
    const projectId = req.header('x-project-id') || req.query.projectId || req.body.projectId
    if (projectId) {
      req.projectId = projectId

      // You can extend this block to fetch project data and check access
      // Example:
      // const project = await Project.findById(projectId)
      // const isMember = project.members.find(m => m.userId.equals(decoded.id))
      // if (!isMember) return res.status(403).json({ message: 'You do not have access to this project' })
    }

    req.user = decoded

    logger.info('Authorization successful', {
      userId: decoded.id,
      role: decoded.role,
      isActive: decoded.isActive,
      projectId,
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
    })

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired', {
        error: error.message,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
      })
      return res.status(401).json({ message: 'Token has expired, please log in again' })
    } else if (error.name === 'JsonWebTokenError') {
      logger.error('Invalid token', {
        error: error.message,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
      })
      return res.status(401).json({ message: 'Invalid token, authorization denied' })
    } else {
      logger.error('Token verification error', {
        error: error.message,
        stack: error.stack,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
      })
      return res.status(500).json({ message: 'Internal server error during token verification' })
    }
  }
}

export default authMiddleware
