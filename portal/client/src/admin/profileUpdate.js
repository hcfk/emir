import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormFeedback,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CRow,
  CCol,
} from '@coreui/react'
import axios from '../utils/axiosInstance'

const ProfileUpdate = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    telegram_username: '',
    whatsapp_number: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProfile(response.data.user)
        setError('')
      } catch (error) {
        console.error('Error on getting profile:', error.response?.data || error.message)
        setError('Profile cannot be retrieved.')
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)
  const isValidPhoneNumber = (number) => /^\+\d{8,15}$/.test(number)

  const validate = () => {
    const newErrors = {}
    if (!profile.username) newErrors.username = 'Username is mandatory.'
    if (!profile.email) newErrors.email = 'email is mandatory.'
    else if (!isValidEmail(profile.email)) newErrors.email = 'wrong email formay.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put(`/users/update-user/${profile._id}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(data.message)
      setError('')
      console.log('Profile successfully updated.', data.user)
    } catch (error) {
      console.error('Error updating the profile.', error.response?.data || error.message)
      setError('While updating profile an error occured.')
      setMessage('')
    }
  }

  return (
    <CCard className="mt-4">
      <CCardHeader>
        <h5>Update Profile</h5>
      </CCardHeader>
      <CCardBody>
        {message && <CAlert color="success">{message}</CAlert>}
        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <CFormLabel htmlFor="username">User Name</CFormLabel>
            <CFormInput
              type="text"
              id="username"
              name="username"
              placeholder="username"
              value={profile.username}
              onChange={handleChange}
              invalid={!!errors.username}
            />
            <small className="text-muted">your username is required.</small>
            {errors.username && <CFormFeedback invalid>{errors.username}</CFormFeedback>}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              placeholder="Email adresinizi giriniz"
              value={profile.email}
              onChange={handleChange}
              invalid={!!errors.email}
            />
            <small className="text-muted">Please input a valid email address</small>
            {errors.email && <CFormFeedback invalid>{errors.email}</CFormFeedback>}
          </div>

          <CRow>
            <CCol className="text-right">
              <CButton color="primary" type="submit">
                Update Profile
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ProfileUpdate
