package com.emir.androidapp.location

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.emir.androidapp.network.ApiClient
import com.emir.androidapp.network.LocationPayload
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class LocationUploadWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val lat = inputData.getDouble("latitude", 0.0)
        val lon = inputData.getDouble("longitude", 0.0)

        Log.d("EMIR", "Uploading location: $lat, $lon")

        return withContext(Dispatchers.IO) {
            try {
                val payload = LocationPayload(latitude = lat, longitude = lon)
                ApiClient.service.uploadLocation(payload)
                Log.d("EMIR", "Location upload successful")
                Result.success()
            } catch (e: Exception) {
                Log.e("EMIR", "Location upload failed", e)
                Result.retry()
            }
        }
    }
}
