import firebaseService from '../services/firebaseService.js';
import logger from '../utils/logger.js';

const sendNotification = async (req, res) => {
  const { fcmToken, title, body, data } = req.body;

  if (!fcmToken || !title || !body) {
    logger.warn('⚠️ Missing required fields');
    return res.status(400).json({ error: 'fcmToken, title, and body are required' });
  }

  try {
    const response = await firebaseService.sendPushNotification(fcmToken, { title, body, data });
    res.status(200).json({ success: true, messageId: response });
  } catch (err) {
    logger.error('❌ Notification sending failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { sendNotification };
