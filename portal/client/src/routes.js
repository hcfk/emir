import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//USer
const ProfileUpdate = React.lazy(() => import('./admin/profileUpdate'))
const PasswordChange = React.lazy(() => import('./admin/passwordChange'))
//admin
const UserManagement = React.lazy(() => import('./admin/userManagement'))
//talents
const Chat = React.lazy(() => import('./talents/Chat'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin/profileUpdate', name: 'ProfileUpdate', element: ProfileUpdate },
  { path: '/admin/passwordChange', name: 'PasswordChange', element: PasswordChange },
  { path: '/admin/userManagement', name: 'UserManagement', element: UserManagement },
  { path: '/talents/chat', name: 'Chat', element: Chat },
]

export default routes
