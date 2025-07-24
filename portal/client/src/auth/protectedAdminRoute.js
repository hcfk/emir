import React from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedAdminRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth)
  console.log('auth in ProtectedRoute:', auth) // This will log the value to the console
  const location = useLocation()

  // Check if the user is authenticated and has the admin role
  const isAuthenticated = auth ? auth.isAuthenticated : false
  const isAdmin = auth ? auth.role === 'admin' : false
  const isContentAdmin = auth ? auth.role === 'contentadmin' : false

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  if (!isAdmin) {
    return <Navigate to="/not-authorized" replace />
  }
  if (!isContentAdmin) {
    return <Navigate to="/not-authorized" replace />
  }
  // Render children if user is authenticated and an admin
  return children
}

// Add prop types validation
ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedAdminRoute
