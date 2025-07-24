package com.emir.androidapp.ui

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.emir.androidapp.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    isTracking: Boolean,
    lastKnownLocation: String?,
    fcmToken: String?,
    onStartTracking: () -> Unit,
    onStopTracking: () -> Unit,
    onCopyToken: () -> Unit,
    onOpenCommandList: () -> Unit,
    viewModel: HomeViewModel
) {
    val latestCommand by viewModel.latestCommand.collectAsState()

    Log.d("EMIR", "✅ HomeScreen recomposed — latestCommand: $latestCommand")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "EMIR Tracker",
            style = MaterialTheme.typography.headlineMedium
        )

        Text(
            text = "Tracking Status: ${if (isTracking) "Active" else "Stopped"}"
        )

        lastKnownLocation?.let {
            Text(
                text = "Last Location: $it"
            )
        }

        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Button(onClick = onStartTracking, enabled = !isTracking) {
                Text("Start Tracking")
            }
            Button(onClick = onStopTracking, enabled = isTracking) {
                Text("Stop Tracking")
            }
        }

        Divider()

        Text("Push Token:")

        Text(
            text = fcmToken ?: "Not registered",
            style = MaterialTheme.typography.bodySmall
        )

        Button(onClick = onCopyToken, enabled = fcmToken != null) {
            Text("Copy Token")
        }

        Divider()

        Text(
            text = "Latest Command:",
            style = MaterialTheme.typography.titleMedium
        )

        if (latestCommand != null) {
            Text("ID: ${latestCommand!!.id}")
            Text("Title: ${latestCommand!!.title}")
            Text("Status: ${latestCommand!!.status}")
        } else {
            Text("No commands yet")
        }

        Button(onClick = onOpenCommandList) {
            Text("Open All Commands")
        }
    }
}
