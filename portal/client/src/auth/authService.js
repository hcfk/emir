import axios from '../utils/axiosInstance'
import store from '../store/store' // Adjust the path as necessary
import { loginSuccess, logoutSuccess } from '../store/slices/authSlice' // Adjust the path as needed

export const authService = {
  async login(userData) {
    try {
      // Replace with your actual API call for login
      const response = await axios.post(`/auth/login`, userData)
      const user = response.data

      // Store the token in localStorage or any secure storage
      console.log('User logged in:', user)
      localStorage.setItem('token', user.token)
      console.log('Token stored in localStorage')
      // Dispatch the loginSuccess action to update Redux state
      store.dispatch(loginSuccess({ token: user.token, user: user.user }))
      console.log('loginSuccess dispatched')
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error.response?.data || { message: 'An error occurred during login' }
    }
  },

  async logout() {
    try {
      // Implement your logout logic here (e.g., API call if needed)
      // Clear the token from localStorage
      localStorage.removeItem('token')

      // Dispatch the logoutSuccess action to update Redux state
      store.dispatch(logoutSuccess())
    } catch (error) {
      console.error('Logout error:', error)
      throw { message: 'An error occurred during logout' }
    }
  },
  async register(userData) {
    try {
      const response = await axios.post(`/auth/register`, userData)
      console.log('User registered:')
    } catch (error) {
      console.error('Registration error:', error)
      throw error.response?.data || { message: 'An error occurred during registration' }
    }
  },
}
