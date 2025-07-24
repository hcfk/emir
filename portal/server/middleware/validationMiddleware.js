//middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator'
import logger from '../utils/logger.js'

export const validateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Username may only contain letters, numbers, dots (.), and dashes (-)'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      logger.warn('Validation failed for user input', {
        ip: req.ip,
        user: req.user ? req.user.id : 'anonymous',
        errors: errors.array(),
      })
      return res.status(400).json({ errors: errors.array() })
    }

    logger.info('Validation passed for user input', {
      ip: req.ip,
      user: req.user ? req.user.id : 'anonymous',
      body: {
        username: req.body.username,
        email: req.body.email,
      },
    })

    next()
  },
]
