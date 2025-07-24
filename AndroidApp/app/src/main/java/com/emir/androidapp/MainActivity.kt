package com.emir.androidapp

import android.Manifest
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*
import com.emir.androidapp.location.LocationService
import com.emir.androidapp.ui.HomeScreen
import com.emir.androidapp.ui.theme.EMIRTheme
import com.emir.androidapp.viewmodel.HomeViewModel // ✅ if using a ViewModel

class MainActivity : ComponentActivity() {

    private lateinit var locationService: LocationService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        locationService = LocationService(this)

        setContent {
            var fcmToken by remember { mutableStateOf<String?>(null) }
            var isTracking by remember { mutableStateOf(false) }

            // ✅ Load token safely
            LaunchedEffect(Unit) {
                try {
                    val prefs = getSharedPreferences("emir_prefs", MODE_PRIVATE)
                    fcmToken = prefs.getString("fcm_token", null)
                    Log.d("EMIR", "✅ Loaded FCM token: $fcmToken")
                } catch (e: Exception) {
                    Log.e("EMIR", "❌ Failed to load FCM token: ${e.localizedMessage}", e)
                }
            }

            val permissionsLauncher = rememberLauncherForActivityResult(
                ActivityResultContracts.RequestMultiplePermissions()
            ) { permissions ->
                val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false
                if (granted) {
                    locationService.startLocationUpdates()
                    isTracking = true
                    Toast.makeText(this, "Tracking Started", Toast.LENGTH_SHORT).show()
                    Log.d("EMIR", "✅ Location tracking started.")
                } else {
                    Toast.makeText(this, "Location permission denied.", Toast.LENGTH_SHORT).show()
                    Log.w("EMIR", "⚠️ Location permission denied by user.")
                }
            }

            val location by locationService.lastLocation.collectAsState(null)

            EMIRTheme {
                HomeScreen(
                    isTracking = isTracking,
                    lastKnownLocation = location?.let { "${it.first}, ${it.second}" },
                    fcmToken = fcmToken,
                    onStartTracking = {
                        permissionsLauncher.launch(
                            arrayOf(
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION,
                                Manifest.permission.ACTIVITY_RECOGNITION
                            )
                        )
                    },
                    onStopTracking = {
                        locationService.stopLocationUpdates()
                        isTracking = false
                        Log.d("EMIR", "✅ Location tracking stopped.")
                    },
                    onCopyToken = {
                        try {
                            if (fcmToken.isNullOrEmpty()) {
                                Toast.makeText(this, "No token to copy!", Toast.LENGTH_SHORT).show()
                                Log.w("EMIR", "⚠️ Tried to copy empty token.")
                            } else {
                                val clipboard = getSystemService(CLIPBOARD_SERVICE) as? android.content.ClipboardManager
                                clipboard?.let {
                                    it.setPrimaryClip(android.content.ClipData.newPlainText("FCM Token", fcmToken))
                                    Toast.makeText(this, "FCM Token copied!", Toast.LENGTH_SHORT).show()
                                    Log.d("EMIR", "✅ FCM Token copied: $fcmToken")
                                } ?: run {
                                    Toast.makeText(this, "Clipboard service unavailable.", Toast.LENGTH_SHORT).show()
                                    Log.e("EMIR", "❌ Clipboard service is null.")
                                }
                            }
                        } catch (e: Exception) {
                            Toast.makeText(this, "Error copying token", Toast.LENGTH_SHORT).show()
                            Log.e("EMIR", "❌ Failed to copy token: ${e.localizedMessage}", e)
                        }
                    },
                    onOpenCommandList = {
                        Log.d("EMIR", "➡️ Opening CommandListActivity...")
                        try {
                            startActivity(Intent(this, CommandListActivity::class.java))
                        } catch (e: Exception) {
                            Log.e("EMIR", "❌ Failed to start CommandListActivity: ${e.localizedMessage}", e)
                        }
                    },
                    viewModel = HomeViewModel(this) // ✅ or inject if needed
                )
            }
        }
    }
}
