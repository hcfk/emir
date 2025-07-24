// utils/sequelizeErrorHandler.js
import logger from './logger.js';

export function handleSequelizeError(error, model = 'Unknown') {
  if (error.name === 'SequelizeUniqueConstraintError') {
    logger.error(`[${model}] Unique constraint violation`, {
      fields: error.fields,
      message: error.message
    });
    return new Error(`Duplicate entry detected for: ${Object.keys(error.fields).join(', ')}`);
  }

  logger.error(`[${model}] Sequelize error`, { message: error.message, stack: error.stack });
  return new Error('Database error occurred');
}
