package com.emir.androidapp

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.emir.androidapp.model.Command
import com.emir.androidapp.network.ApiClient
import com.emir.androidapp.ui.theme.EMIRTheme
import kotlinx.coroutines.launch

class CommandDetailActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val commandId = intent.getStringExtra("command_id") ?: "Unknown"

        Log.d("EMIR", "✅ Opened CommandDetailActivity with commandId: $commandId")
        Log.d("EMIR", "✅ Full Intent extras: ${intent.extras}")

        if (commandId == "Unknown") {
            Log.w("EMIR", "⚠️ Command ID is Unknown — opened without push?")
        }

        val api = ApiClient.service // ✅ Use your shared singleton

        setContent {
            EMIRTheme {
                var command by remember { mutableStateOf<Command?>(null) }
                var isLoading by remember { mutableStateOf(true) }
                var error by remember { mutableStateOf<String?>(null) }

                val scope = rememberCoroutineScope()

                LaunchedEffect(Unit) {
                    if (commandId == "Unknown") {
                        error = "No command ID found"
                        Log.w("EMIR", "❌ No valid command ID, skipping fetch.")
                        isLoading = false
                        return@LaunchedEffect
                    }

                    try {
                        Log.d("EMIR", "➡️ Fetching command details for ID=$commandId")
                        val fetched = api.getCommand(commandId)
                        Log.d("EMIR", "✅ Command fetched: $fetched")
                        command = fetched
                    } catch (e: Exception) {
                        Log.e("EMIR", "❌ Failed to fetch command", e)
                        error = "Failed: ${e.localizedMessage}"
                    } finally {
                        isLoading = false
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        when {
                            isLoading -> CircularProgressIndicator()
                            error != null -> {
                                Text(text = "Error: $error")
                                Log.e("EMIR", "❌ Showing error on UI: $error")
                            }
                            command != null -> CommandContent(command!!, onAcknowledge = {
                                scope.launch {
                                    try {
                                        Log.d("EMIR", "➡️ Sending acknowledge for ID=$commandId")
                                        api.acknowledgeCommand(commandId)
                                        Toast.makeText(this@CommandDetailActivity, "✅ Acknowledged!", Toast.LENGTH_SHORT).show()
                                        Log.d("EMIR", "✅ Acknowledge succeeded")
                                    } catch (e: Exception) {
                                        Toast.makeText(this@CommandDetailActivity, "❌ Failed to acknowledge", Toast.LENGTH_SHORT).show()
                                        Log.e("EMIR", "❌ Acknowledge failed", e)
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CommandContent(command: Command, onAcknowledge: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(24.dp)
    ) {
        Text("Command Details", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        Text("ID: ${command.id}")
        Text("Title: ${command.title}")
        Text("Description: ${command.description}")
        Text("Status: ${command.status}")
        Text("Created At: ${command.createdAt}")
        Spacer(Modifier.height(24.dp))
        Button(onClick = onAcknowledge) {
            Text("Acknowledge")
        }
    }
}
