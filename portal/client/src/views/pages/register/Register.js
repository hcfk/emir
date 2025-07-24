import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../../auth/authService' // Adjust the path as necessary

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false) // Loading state for the button
  const navigate = useNavigate()

  const validateUsername = (username) => {
    const turkishCharacters = /[çÇğĞıİöÖşŞüÜ]/ // Turkish characters
    const invalidCharacters = /[^a-zA-Z0-9.-]/ // Invalid characters (excluding a-z, 0-9, ., and -)
    const spaces = /\s/ // Spaces

    if (turkishCharacters.test(username)) {
      return 'user Naame shall not include Turkish Characters'
    }
    if (spaces.test(username)) {
      return 'User Name shall not include spaces'
    }
    if (invalidCharacters.test(username)) {
      return 'Username can only contain letters, numbers, dots (.) and hyphens (-)!'
    }
    return null
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const usernameError = validateUsername(username)
    if (usernameError) {
      alert(usernameError)
      return
    }

    if (password !== confirmPassword) {
      alert('Şifreler eşleşmiyor!')
      return
    }

    setLoading(true) // Disable the button

    try {
      // Call the register function from authService
      const user = await authService.register({
        username: username.toLowerCase(), // Convert username to lowercase
        email,
        password,
        role: 'normal', // Setting default role as 'normal'
        isActive: false, // Set isActive to true
      })

      // Redirect to login or perform additional actions if needed
      alert('Kayıt başarılı!')
      navigate('/login') // Redirect to login page after registration
    } catch (error) {
      console.error('Kayıt hatası:', error)
      alert(error.message || 'Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.')
    } finally {
      setLoading(false) // Re-enable the button
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Kayıt</h1>
                  <p className="text-body-secondary">Hesabınızı oluşturun</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="User Name"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Şifre"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="şifre tekrar"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Oluşturuluyor...' : 'Hesabı Oluştur'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
