package com.emir.androidapp.db

import androidx.room.Database
import androidx.room.RoomDatabase
import com.emir.androidapp.model.Command

@Database(entities = [Command::class], version = 2)
abstract class AppDatabase : RoomDatabase() {
    abstract fun commandDao(): CommandDao
}
