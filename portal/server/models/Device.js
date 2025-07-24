// models/Device.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Device extends Model {}

  Device.init({
    firebaseToken: { type: DataTypes.STRING, allowNull: false, unique: true },
    appDeviceId: { type: DataTypes.STRING, allowNull: false, unique: true },
    deviceType: {
      type: DataTypes.ENUM('mobile', 'watch', 'tablet'),
      allowNull: false
    },
    screenResolution: DataTypes.STRING,
    androidUsername: DataTypes.STRING,
    osVersion: DataTypes.STRING,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    registeredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    lastSeen: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Device',
    timestamps: true
  });

  return Device;
};