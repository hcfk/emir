package com.emir.androidapp.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.emir.androidapp.model.Command
import com.emir.androidapp.repository.CommandRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CommandListViewModel(
    private val context: Context
) : ViewModel() {

    // ✅ Automatically stays up to date!
    val commands: StateFlow<List<Command>> = CommandRepository.getAll(context)
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        Log.d("EMIR", "✅ CommandListViewModel created with live Flow observer")
    }

    fun markAsRead(id: String) {
        viewModelScope.launch {
            try {
                CommandRepository.markAsRead(context, id)
                Log.d("EMIR", "✅ Marked $id as read.")
                // ❌ No manual reload — stateIn auto-updates
            } catch (e: Exception) {
                Log.e("EMIR", "❌ Failed to mark $id as read: ${e.localizedMessage}", e)
            }
        }
    }

    companion object {
        fun Factory(context: Context): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return CommandListViewModel(context) as T
                }
            }
    }
}
