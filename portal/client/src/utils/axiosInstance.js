// src/api/axiosInstance.js
import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost'

// Create Axios instance once with a base URL
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_PATH}`,
})

// Add a request interceptor to add Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Retrieve token from localStorage each time
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Optional: Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - redirecting to login')
      // Remove token from storage and redirect to login if unauthorized
      //localStorage.removeItem('authToken')
      //window.location.replace('/login')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
