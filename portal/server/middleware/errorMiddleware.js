import logger from '../utils/logger.js' // ESModule import

const errorHandler = (err, req, res, next) => {
  logger.error('Error encountered', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  })

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message,
  })
}

export default errorHandler
