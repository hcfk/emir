import admin from 'firebase-admin';
import serviceAccount from '../config/firebase-service-account.json' assert { type: 'json' };
import logger from '../utils/logger.js';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info('✅ Firebase Admin initialized');
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase Admin:', error);
  }
}

const sendPushNotification = async (fcmToken, payload) => {
  try {
    const response = await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
    });
    logger.info(`✅ Notification sent: ${response}`);
    return response;
  } catch (err) {
    logger.error('❌ Failed to send push notification:', err);
    throw err;
  }
};

export default { sendPushNotification };
