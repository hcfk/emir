import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Management Panel',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: { color: 'info', text: 'NEW' },
  },
  {
    component: CNavGroup,
    name: 'User',
    to: '/admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Update Profile', to: '/admin/profileUpdate' },
      { component: CNavItem, name: 'Change Password', to: '/admin/passwordChange' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Admin Tools',
    to: '/admin',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'User Management', to: '/admin/userManagement' }],
  },

  // Additional components, forms, charts, icons, etc.
]

export default _nav
