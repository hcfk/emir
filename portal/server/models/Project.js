// models/Project.js
import { DataTypes, Model } from 'sequelize';
import logger from '../utils/logger.js';

export default (sequelize) => {
  class Project extends Model {}

  Project.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Project',
    timestamps: true,
    hooks: {
      afterCreate(project) {
        logger.info('New project created', project.toJSON());
      },
      afterUpdate(project) {
        logger.info('Project updated', project.toJSON());
      },
      afterDestroy(project) {
        logger.warn('Project deleted', { id: project.id });
      }
    }
  });

  return Project;
};
