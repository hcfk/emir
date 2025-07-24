import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  user: null,
  role: null, // Add role to initial state
  isActive: false, // Add isActive to initial state
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.role = action.payload.user.role // Set role on login
      state.isActive = action.payload.user.isActive // Set role on login
      state.isAuthenticated = true
    },
    logoutSuccess: (state) => {
      state.token = null
      state.user = null
      state.role = null // Clear role on logout
      state.isActive = false // Clear role on logout
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.role = null // Clear role on logout
      state.isActive = false // Clear role on logout
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, logoutSuccess, logout } = authSlice.actions
export default authSlice.reducer
