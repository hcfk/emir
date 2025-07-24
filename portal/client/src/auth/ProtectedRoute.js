import React from 'react'
import PropTypes from 'prop-types' // Import prop-types
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth)
  console.log('auth in ProtectedRoute:', auth) // This will log the value to the console
  const isAuthenticated = auth ? auth.isAuthenticated : false // Safeguard against undefined state
  const location = useLocation()
  console.log('isAuthenticated in ProtectedRoute:', isAuthenticated) // This will log the value to the console
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />
}

// Add prop types validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
