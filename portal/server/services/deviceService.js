// services/deviceService.js
import DeviceModel from '../models/Device.js';
import logger from '../utils/logger.js';

const registerOrUpdateDevice = async (sequelize, deviceData) => {
  const Device = DeviceModel(sequelize);

  try {
    const {
      firebaseToken,
      appDeviceId,
      deviceType,
      screenResolution,
      androidUsername,
      osVersion,
      brand,
      model
    } = deviceData;

    if (!firebaseToken || !appDeviceId || !deviceType) {
      const missing = [];
      if (!firebaseToken) missing.push('firebaseToken');
      if (!appDeviceId) missing.push('appDeviceId');
      if (!deviceType) missing.push('deviceType');
      const message = `Missing required field(s): ${missing.join(', ')}`;
      logger.warn(message);
      throw new Error(message);
    }

    const existingDevice = await Device.findOne({ where: { appDeviceId } });

    if (existingDevice) {
      logger.info(`🔄 Updating existing device: ${appDeviceId}`);
      await existingDevice.update({
        firebaseToken,
        deviceType,
        screenResolution: screenResolution || existingDevice.screenResolution,
        androidUsername: androidUsername || existingDevice.androidUsername,
        osVersion: osVersion || existingDevice.osVersion,
        brand: brand || existingDevice.brand,
        model: model || existingDevice.model,
        lastSeen: new Date()
      });
      return { updated: true, device: existingDevice };
    } else {
      logger.info(`🆕 Registering new device: ${appDeviceId}`);
      const newDevice = await Device.create({
        firebaseToken,
        appDeviceId,
        deviceType,
        screenResolution,
        androidUsername,
        osVersion,
        brand,
        model
      });
      return { created: true, device: newDevice };
    }
  } catch (error) {
    logger.error(`❌ Device registration failed: ${error.message}`, { error });
    throw error;
  }
};

export default {
  registerOrUpdateDevice
};