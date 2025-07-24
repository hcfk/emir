package com.emir.androidapp.repository

import android.content.Context
import android.util.Log
import androidx.room.Room
import com.emir.androidapp.db.AppDatabase
import com.emir.androidapp.model.Command
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf


object CommandRepository {

    private fun getDatabase(context: Context): AppDatabase {
        return Room.databaseBuilder(
            context.applicationContext,
            AppDatabase::class.java,
            "emir.db"
        ).fallbackToDestructiveMigration().build()
    }

    suspend fun insert(context: Context, command: Command) {
        try {
            getDatabase(context).commandDao().insert(command)
            Log.d("EMIR", "✅ Command inserted")
        } catch (e: Exception) {
            Log.e("EMIR", "❌ Insert failed: ${e.localizedMessage}", e)
        }
    }

    fun getLatest(context: Context): Flow<Command?> {
        return try {
            getDatabase(context).commandDao().getLatestCommand()
        } catch (e: Exception) {
            Log.e("EMIR", "❌ getAll failed: ${e.localizedMessage}", e)
            flowOf(null)
        }
    }

    fun getAll(context: Context): Flow<List<Command>> {
        return try {
            getDatabase(context).commandDao().getAll()
        } catch (e: Exception) {
            Log.e("EMIR", "❌ getAll failed: ${e.localizedMessage}", e)
            flowOf(emptyList())  // fallback
        }
    }

    suspend fun markAsRead(context: Context, id: String) {
        try {
            getDatabase(context).commandDao().markAsRead(id)
            Log.d("EMIR", "✅ Marked as read: $id")
        } catch (e: Exception) {
            Log.e("EMIR", "❌ Mark as read failed: ${e.localizedMessage}", e)
        }
    }
}
