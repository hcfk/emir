import React, { useState } from 'react'
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
} from '@coreui/react'
import axios from '../utils/axiosInstance'

const PasswordChange = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' }) // Reset error on change
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.currentPassword) newErrors.currentPassword = 'Old Password is needed'
    if (!formData.newPassword) newErrors.newPassword = 'New Password is needed.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.put('/users/change-password', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage(data.message)
      setError('')
    } catch (error) {
      setError(error.response?.data?.error || 'Error on changing password.')
      setMessage('')
    }
  }

  return (
    <CCard className="mt-4">
      <CCardHeader>
        <h5>Şifre Değiştir</h5>
      </CCardHeader>
      <CCardBody>
        {message && <CAlert color="success">{message}</CAlert>}
        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <CFormLabel htmlFor="currentPassword">Eski Şifre</CFormLabel>
            <CFormInput
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              invalid={!!errors.currentPassword}
            />
            {errors.currentPassword && (
              <CFormFeedback invalid>{errors.currentPassword}</CFormFeedback>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="newPassword">Yeni Şifre</CFormLabel>
            <CFormInput
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              invalid={!!errors.newPassword}
            />
            {errors.newPassword && <CFormFeedback invalid>{errors.newPassword}</CFormFeedback>}
          </div>

          <CButton color="primary" type="submit">
            Şifreyi Güncelle
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default PasswordChange
