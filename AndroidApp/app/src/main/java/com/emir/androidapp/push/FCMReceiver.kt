package com.emir.androidapp.push

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.emir.androidapp.CommandDetailActivity
import com.emir.androidapp.MainActivity
import com.emir.androidapp.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import kotlinx.coroutines.CoroutineScope           // ✅ NEW
import kotlinx.coroutines.Dispatchers             // ✅ NEW
import kotlinx.coroutines.launch                  // ✅ NEW

import com.emir.androidapp.model.Command
import com.emir.androidapp.repository.CommandRepository

class FCMReceiver : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        Log.d("EMIR", "✅ FCM message received")

        val title = remoteMessage.notification?.title ?: "EMIR"
        val body = remoteMessage.notification?.body ?: "New command received."

        val data = remoteMessage.data
        Log.d("EMIR", "✅ Data payload: $data")

        val commandId = data["command_id"]

        // ✅ 1️⃣ Always show the system push notification
        try {
            showNotification(this, title, body, commandId)
        } catch (e: Exception) {
            Log.e("EMIR", "❌ Error posting notification: ${e.localizedMessage}", e)
        }

        // ✅ 2️⃣ Also persist it into Room
        if (commandId != null) {
            val command = Command(
                id = commandId,
                title = title,
                description = body,
                status = "NEW",
                createdAt = System.currentTimeMillis().toString()
            )

            // ✅ Safe coroutine for Room write
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    CommandRepository.insert(applicationContext, command)
                } catch (e: Exception) {
                    Log.e("EMIR", "❌ Failed to insert command: ${e.localizedMessage}", e)
                }
            }
        } else {
            Log.w("EMIR", "⚠️ No command_id in payload, not saving to DB")
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)

        Log.d("EMIR", "✅ New FCM token: $token")

        // Save to SharedPreferences
        try {
            val prefs = getSharedPreferences("emir_prefs", MODE_PRIVATE)
            prefs.edit().putString("fcm_token", token).apply()
            Log.d("EMIR", "✅ Saved FCM token to prefs")
        } catch (e: Exception) {
            Log.e("EMIR", "❌ Failed to save FCM token", e)
        }

        // TODO: Send to backend if needed
    }

    private fun showNotification(context: Context, title: String, body: String, commandId: String? = null) {
        val channelId = "emir_notifications"
        val notificationId = 101

        try {
            val intent = if (commandId != null) {
                Intent(context, CommandDetailActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    putExtra("command_id", commandId)
                }
            } else {
                Intent(context, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                }
            }

            Log.d("EMIR", "✅ Building PendingIntent with commandId=$commandId")

            val pendingIntent = PendingIntent.getActivity(
                context,
                notificationId, // ✅ Makes PendingIntent unique per notification
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notificationBuilder = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground) // ✅ Replace with your icon
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH) // ✅ Important for heads-up
                .setContentIntent(pendingIntent)

            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                try {
                    val channel = NotificationChannel(
                        channelId,
                        "EMIR Notifications",
                        NotificationManager.IMPORTANCE_HIGH
                    ).apply {
                        description = "Push notifications for EMIR commands"
                    }
                    notificationManager.createNotificationChannel(channel)
                    Log.d("EMIR", "✅ Notification channel created")
                } catch (e: Exception) {
                    Log.e("EMIR", "❌ Failed to create channel: ${e.localizedMessage}", e)
                }
            }

            notificationManager.notify(notificationId, notificationBuilder.build())
            Log.d("EMIR", "✅ Notification posted successfully.")
        } catch (e: Exception) {
            Log.e("EMIR", "❌ showNotification failed: ${e.localizedMessage}", e)
        }
    }
}
