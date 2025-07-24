package com.emir.androidapp.location

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import com.google.android.gms.location.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class LocationService(private val context: Context) {

    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

    private var locationCallback: LocationCallback? = null

    private val _lastLocation = MutableStateFlow<Pair<Double, Double>?>(null)
    val lastLocation: StateFlow<Pair<Double, Double>?> = _lastLocation

    @SuppressLint("MissingPermission")
    fun startLocationUpdates(highAccuracy: Boolean = true) {
        Log.d("EMIR", "Starting location updates...")

        val priority = if (highAccuracy) {
            Priority.PRIORITY_HIGH_ACCURACY
        } else {
            Priority.PRIORITY_BALANCED_POWER_ACCURACY
        }

        val locationRequest = LocationRequest.Builder(priority, 10_000L).build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                for (location in result.locations) {
                    Log.d("EMIR", "New location: ${location.latitude}, ${location.longitude}")
                    _lastLocation.value = Pair(location.latitude, location.longitude)
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback as LocationCallback,
            null
        )
    }

    fun stopLocationUpdates() {
        Log.d("EMIR", "Stopping location updates...")
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
        }
        locationCallback = null
    }
}
