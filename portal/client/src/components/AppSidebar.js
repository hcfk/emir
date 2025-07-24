import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import { toggleSidebar, setSidebarVisibility } from '../store/slices/uiSlice' // Import actions from uiSlice

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.unfoldable) // Access unfoldable state
  const sidebarShow = useSelector((state) => state.ui.sidebarShow) // Access sidebarShow state
  const userRole = useSelector((state) => state.auth.user?.role) || 'normal'

  // Filter the navigation items based on user role
  const filteredNavigation = navigation.filter((item) => {
    // Only show "Admin Tools" for admin users
    if (item.name === 'Admin Tools' && userRole == 'normal') {
      return false
    }
    return true
  })
  const contentfilteredNavigation = navigation.filter((item) => {
    // Only show "Admin Tools" for admin users
    if (item.name === 'Admin Tools' && userRole == 'normal') {
      return false
    }
    return true
  })
  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        // Dispatch the visibility change action
        dispatch(setSidebarVisibility(visible))
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={48} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={48} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarVisibility(false))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNavigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch(toggleSidebar())} // Toggle unfoldable state
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
