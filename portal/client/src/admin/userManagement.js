import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import axios from '../utils/axiosInstance'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/users/users')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message)
      setError('User List could not be loaded.')
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
    clearMessages()
  }

  const handlePasswordReset = (user) => {
    setSelectedUser(user)
    setShowPasswordModal(true)
    setNewPassword('')
    clearMessages()
  }

  const updateUser = async () => {
    if (!selectedUser?.role || selectedUser.role === '') {
      setError('Role cannot be empty')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `users/update-user/${selectedUser._id}`,
        {
          role: selectedUser.role,
          isActive: selectedUser.isActive,
          username: selectedUser.username,
          email: selectedUser.email,
          telegram_username: selectedUser.telegram_username || '',
          whatsapp_number: selectedUser.whatsapp_number || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMessage(response.data.message || 'User updated successfully')
      setShowEditModal(false)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message)
      setError('Error while updating the user')
    }
  }

  const updatePassword = async () => {
    if (newPassword.length < 6) {
      setError('Password shall be at least 6 characters long.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `/users/users/${selectedUser._id}/set-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMessage(response.data.message || 'Password succesfully updated')
      setShowPasswordModal(false)
      fetchUsers()
    } catch (error) {
      console.error('Error updating password:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Error while updating the password.')
    }
  }

  const clearMessages = () => {
    setMessage('')
    setError('')
  }

  return (
    <>
      <h3>User Management</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>User Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Processes</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user._id}>
              <CTableDataCell>{user.username}</CTableDataCell>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
              <CTableDataCell>
                <input
                  type="checkbox"
                  checked={user.isActive}
                  onChange={() =>
                    setUsers(
                      users.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)),
                    )
                  }
                />
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="info" onClick={() => handleEditUser(user)}>
                  Düzenle
                </CButton>
                <CButton color="warning" onClick={() => handlePasswordReset(user)}>
                  Şifre Ayarla
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Edit User Modal */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader closeButton>Modify User</CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>User Name</CFormLabel>
              <CFormInput
                value={selectedUser?.username || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Email</CFormLabel>
              <CFormInput
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Rol</CFormLabel>
              <CFormSelect
                value={selectedUser?.role || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="">Rol Seçin</option>
                <option value="admin">Admin</option>
                <option value="normal">Normal</option>
                {/* Future feature <option value="contentadmin">Content Admin</option> */}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel>Aktif</CFormLabel>
              <input
                type="checkbox"
                checked={selectedUser?.isActive || false}
                onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={updateUser}>
            Güncelle
          </CButton>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Password Reset Modal */}
      <CModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <CModalHeader closeButton>Arrange Password</CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel>New Password</CFormLabel>
              <CFormInput
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={updatePassword}>
            Şifreyi Güncelle
          </CButton>
          <CButton color="secondary" onClick={() => setShowPasswordModal(false)}>
            İptal
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserManagement
