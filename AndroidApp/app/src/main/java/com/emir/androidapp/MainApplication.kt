package com.emir.androidapp

import android.app.Application
import android.util.Log
import com.google.firebase.messaging.FirebaseMessaging

class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val token = task.result
                Log.d("EMIR", "FCM Token (App): $token")

                // ✅ ✅ ✅ NEW: Save token to SharedPreferences
                val prefs = getSharedPreferences("emir_prefs", MODE_PRIVATE)
                prefs.edit().putString("fcm_token", token).apply()

                // ✅ You can still send to your backend here if you want
                // TODO: Send to backend /api/v1/register-push

            } else {
                Log.w("EMIR", "Failed to get FCM token", task.exception)
            }
        }
    }
}
