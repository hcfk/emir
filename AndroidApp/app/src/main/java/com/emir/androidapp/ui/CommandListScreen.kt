package com.emir.androidapp.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.emir.androidapp.model.Command
import com.emir.androidapp.viewmodel.CommandListViewModel
import com.emir.androidapp.viewmodel.CommandListViewModelFactory

@Composable
fun CommandListScreen(
    onCommandClick: (Command) -> Unit
) {
    val context = LocalContext.current
    val factory = CommandListViewModelFactory(context)
    val viewModel: CommandListViewModel = viewModel(factory = factory)

    val commands = viewModel.commands.collectAsState()

    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        items(commands.value) { command ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clickable {
                        onCommandClick(command)
                        viewModel.markAsRead(command.id)
                    }
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("ID: ${command.id}")
                    Text(command.title)
                    Text(command.description)
                    if (!command.isRead) {
                        Text("🆕 UNREAD", color = Color.Red)
                    }
                }
            }
        }
    }
}
