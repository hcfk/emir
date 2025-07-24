import { DataTypes, Model } from 'sequelize';
import logger from '../utils/logger.js';

export default (sequelize) => {
  class User extends Model {}

  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: {
      type: DataTypes.ENUM('superadmin', 'projectadmin', 'projectuser'),
      defaultValue: 'projectuser'
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    hooks: {
      afterCreate(user) {
        logger.info('New user created', {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
      },
      afterUpdate(user) {
        logger.info('User updated', {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        });
      },
      afterDestroy(user) {
        logger.warn('User deleted', {
          id: user.id,
          username: user.username
        });
      }
    }
  });

  return User;
};
