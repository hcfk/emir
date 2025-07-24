import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import winston from 'winston'
import http from 'http'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize';



// Custom imports (ensure all use `export default`)
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'

// ===== Setup .env =====
dotenv.config();
const ENV = process.env.NODE_ENV || 'development';
console.log('Environment:', ENV);


// ESModule fix for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, 'uploads')



// ===== Setup Sequelize =====
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

// Test Sequelize connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL + PostGIS via Sequelize');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
})();


//firebase services
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

console.log('Environment:', ENV)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vdcDB'

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

// Ensure uploads directory exists

// Init Express
const app = express()

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      return callback(null, true)
    },
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url} from IP ${req.ip}`)
  next()
})

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

// Central error handler
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  })
  errorHandler(err, req, res, next)
})

// Start HTTP server
const PORT = process.env.PORT || 5005
http.createServer(app).listen(PORT, () => {
  logger.info(`🚀 Server running on http://0.0.0.0:${PORT}`)
})
