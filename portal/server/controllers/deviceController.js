// controllers/deviceController.js
import deviceService from '../services/deviceService.js';
import logger from '../utils/logger.js';

const registerDevice = async (req, res) => {
  const sequelize = req.app.get('sequelize');

  try {
    const deviceData = req.body;
    logger.info('📥 Incoming device registration', { deviceData });

    const result = await deviceService.registerOrUpdateDevice(sequelize, deviceData);

    if (result.created) {
      logger.info('✅ New device registered', { appDeviceId: result.device.appDeviceId });
      return res.status(201).json({
        message: 'Device registered successfully',
        device: result.device
      });
    } else {
      logger.info('✅ Existing device updated', { appDeviceId: result.device.appDeviceId });
      return res.status(200).json({
        message: 'Device updated successfully',
        device: result.device
      });
    }

  } catch (error) {
    logger.error('❌ Device registration error', { error: error.message });
    return res.status(500).json({
      message: 'Device registration failed',
      error: error.message
    });
  }
};

export default {
  registerDevice
};
