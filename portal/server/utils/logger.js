import { createLogger, format, transports } from 'winston'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

dotenv.config()

// __dirname replacement for ESModules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDirectory = process.env.LOG_DIR
  ? path.resolve(__dirname, '..', process.env.LOG_DIR)
  : path.resolve(__dirname, '..', 'logs')

// Ensure log directory exists
try {
  if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory, { recursive: true })
} catch (_) {
  // ignore directory creation errors; console transport will still work
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'file-queue-service' },
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
})

// Add debug file transport in non-development environments
if (process.env.NODE_ENV !== 'development') {
  logger.add(new transports.File({ filename: path.join(logDirectory, 'debug.log'), level: 'debug' }))
}

export default logger
