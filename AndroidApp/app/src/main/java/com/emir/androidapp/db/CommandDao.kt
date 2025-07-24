package com.emir.androidapp.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Delete
import androidx.room.OnConflictStrategy

import androidx.room.Update
import com.emir.androidapp.model.Command
import kotlinx.coroutines.flow.Flow

@Dao
interface CommandDao {
    @Query("SELECT * FROM commands ORDER BY createdAt DESC")
    fun getAll(): Flow<List<Command>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(command: Command)

    @Query("UPDATE commands SET isRead = 1 WHERE id = :id")
    suspend fun markAsRead(id: String)

    @Query("SELECT * FROM commands ORDER BY createdAt DESC LIMIT 1")
    fun getLatestCommand(): Flow<Command?>
}