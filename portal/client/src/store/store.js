import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice' // Replace changeState with uiSlice

const store = configureStore({
  reducer: {
    ui: uiReducer, // UI state (sidebar and theme)
    auth: authReducer, // Authentication state
  },
  devTools: process.env.NODE_ENV === 'development', // Enable DevTools in development
})

export default store
