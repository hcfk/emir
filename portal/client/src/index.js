import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import axiosInstance from './utils/axiosInstance'
import App from './App' // Your main application component
import store from './store/store' // The Redux store

// Integrating the Redux store with the React app
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
