import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice' // Adjust the path if needed

import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom' // Import useNavigate

import avatar8 from './../../assets/images/avatars/8.jpg'
import { Link } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/login') // Redirect after logout if needed
  }

  const handleUpdateProfile = () => {
    navigate('/admin/profileUpdate') // Redirect after logout if needed
  }
  const handlePassword = () => {
    navigate('/admin/passwordChange') // Redirect after logout if needed
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Hesap</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Güncellemeler
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Mesajlar
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem onClick={handlePassword}>
          <CIcon icon={cilTask} className="me-2" />
          Hesabım
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Ayarlar</CDropdownHeader>
        <CDropdownItem onClick={handleUpdateProfile}>
          <CIcon icon={cilUser} className="me-2" />
          Porfilim
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Ayarlar
        </CDropdownItem> */}
        <CDropdownDivider />

        <CDropdownDivider />
        {/* Add onClick for logout */}
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Çıkış
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
