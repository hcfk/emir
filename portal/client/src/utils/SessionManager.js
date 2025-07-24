import { jwtDecode } from 'jwt-decode'
// Install this package if you haven't already with `npm install jwt-decode`

// Function to check token expiration
export const isTokenValid = () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000 // Current time in seconds

      if (decodedToken.exp && decodedToken.exp > currentTime) {
        return true // Token is valid
      } else {
        console.warn('Token has expired. Removing token from localStorage.')
        localStorage.removeItem('token') // Remove the expired token
        return false // Token is expired
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      localStorage.removeItem('token') // Remove the invalid token
      return false
    }
  }
  console.info('No token found')
  return false // No token means no valid session
}

// Function to remove the token manually (optional, for logout or session clear)
export const removeToken = () => {
  localStorage.removeItem('token')
  console.info('Token removed from localStorage')
}

// Function to get session variables (e.g., userId, username)
export const getSessionVariables = () => {
  return {
    token: localStorage.getItem('token'),
    userId: sessionStorage.getItem('userId'),
    username: sessionStorage.getItem('username'),
  }
}
