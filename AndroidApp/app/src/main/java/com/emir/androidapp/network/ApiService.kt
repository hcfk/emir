package com.emir.androidapp.network

import com.emir.androidapp.model.Command
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.Path

// --- Data class for your location payload ---
data class LocationPayload(
    val latitude: Double,
    val longitude: Double,
    val timestamp: Long = System.currentTimeMillis()
)

// --- Data class for a command ---
data class Command(
    val id: String,
    val title: String,
    val description: String,
    val status: String,
    val createdAt: String
)

// --- Unified API interface ---
interface ApiService {

    // ✅ Location upload
    @Headers("Content-Type: application/json")
    @POST("/api/v1/locations")
    suspend fun uploadLocation(@Body payload: LocationPayload)

    // ✅ Fetch command by ID
    @GET("/api/v1/command/{id}")
    suspend fun getCommand(@Path("id") id: String): Command

    // ✅ Acknowledge command by ID
    @POST("/api/v1/command/{id}/ack")
    suspend fun acknowledgeCommand(@Path("id") id: String)
}

// --- Singleton Retrofit client ---
object ApiClient {
    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl("https://YOUR_BACKEND_BASE_URL/") // 🔑 Replace with your backend URL
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val service: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}
