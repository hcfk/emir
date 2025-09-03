import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import logger from '../utils/logger.js'

// Lazy import + init to avoid crashing when Firebase is not configured
let admin = null
let firebaseReady = false

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const readServiceAccount = () => {
  try {
    const saPath = path.resolve(__dirname, '../config/firebase-service-account.json')
    if (!fs.existsSync(saPath)) return null
    const raw = fs.readFileSync(saPath, 'utf-8')
    if (!raw || !raw.trim()) return null
    return JSON.parse(raw)
  } catch (e) {
    logger.warn(`Firebase service account JSON not usable: ${e.message}`)
    return null
  }
}

const ensureFirebase = async () => {
  if (firebaseReady) return true
  const serviceAccount = readServiceAccount()
  if (!serviceAccount) {
    logger.warn('Firebase service account missing/empty. Push notifications disabled.')
    return false
  }
  let mod
  try {
    // Dynamic import to avoid hard failure in environments without the dependency
    mod = await import('firebase-admin')
  } catch (e) {
    logger.error('firebase-admin is not installed. Run `npm i firebase-admin` in server/.')
    return false
  }
  admin = mod.default
  try {
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
      logger.info('Firebase Admin initialized')
    }
    firebaseReady = true
    return true
  } catch (e) {
    logger.error('Failed to initialize Firebase Admin:', e)
    return false
  }
}

const sendPushNotification = async (fcmToken, payload) => {
  const ok = await ensureFirebase()
  if (!ok) throw new Error('Firebase is not configured')
  const message = {
    token: fcmToken,
    notification: { title: payload.title, body: payload.body },
    data: payload.data || {},
  }
  try {
    const response = await admin.messaging().send(message)
    logger.info(`Notification sent: ${response}`)
    return response
  } catch (err) {
    logger.error('Failed to send push notification:', err)
    throw err
  }
}

export default { sendPushNotification }

