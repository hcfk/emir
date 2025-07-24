package com.emir.androidapp.model
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "commands")
data class Command(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val status: String,
    val createdAt: String,
    val isRead: Boolean = false
)
