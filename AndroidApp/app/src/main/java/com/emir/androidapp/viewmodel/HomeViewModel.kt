package com.emir.androidapp.viewmodel

import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.emir.androidapp.model.Command
import com.emir.androidapp.repository.CommandRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

class HomeViewModel(context: Context) : ViewModel() {

    val latestCommand: StateFlow<Command?> =
        CommandRepository.getLatest(context)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    init {
        Log.d("EMIR", "✅ HomeViewModel initialized")
    }
}
