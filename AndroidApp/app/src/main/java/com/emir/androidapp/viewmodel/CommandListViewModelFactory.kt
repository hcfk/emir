package com.emir.androidapp.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class CommandListViewModelFactory(
    private val context: Context
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CommandListViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CommandListViewModel(context) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
