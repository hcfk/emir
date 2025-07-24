package com.emir.androidapp

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.emir.androidapp.ui.theme.EMIRTheme
import com.emir.androidapp.viewmodel.CommandListViewModel
import androidx.lifecycle.ViewModelProvider

@OptIn(ExperimentalMaterial3Api::class)
class CommandListActivity : ComponentActivity() {

    private val viewModel: CommandListViewModel by viewModels {
        CommandListViewModel.Factory(applicationContext)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("EMIR", "✅ Opened CommandListActivity")

        setContent {
            EMIRTheme {
                val commands = viewModel.commands.collectAsState()

                Scaffold(
                    topBar = {
                        TopAppBar(
                            title = { Text("Saved Commands") }
                        )
                    }
                ) { innerPadding ->
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .padding(16.dp)
                    ) {
                        items(commands.value) { command ->
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp)
                            ) {
                                Column(Modifier.padding(16.dp)) {
                                    Text("ID: ${command.id}", style = MaterialTheme.typography.titleSmall)
                                    Text(command.title, style = MaterialTheme.typography.titleMedium)
                                    Text(command.description, style = MaterialTheme.typography.bodyMedium)
                                    Text("Status: ${command.status}")
                                    Text("Created: ${command.createdAt}")
                                    if (!command.isRead) {
                                        Text("🆕 UNREAD", color = MaterialTheme.colorScheme.error)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        Log.d("EMIR", "✅ Command list bound to UI")
    }
}
