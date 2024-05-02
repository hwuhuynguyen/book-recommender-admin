import { createBrowserRouter, Navigate } from 'react-router-dom'
import BaseTemplate from '../templates/base.template'
import ProtectedRoute from './ProtectedRoute'
import CategoryLayout from '../layouts/Category'
import UserLayout from '../layouts/User'
import BookLayout from '../layouts/Book'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import DashboardLayout from '../layouts/Dashboard'
import SettingLayout from '../layouts/Settings'

const getDefaultRedirectPath = () => {
  const storedRole = localStorage.getItem('userRole')
  const isAdmin = storedRole === 'ADMIN'
  if (isAdmin) {
    return '/dashboard'
  } else {
    return '/login'
  }
}

const LoginWrapper = () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    return <Navigate to={getDefaultRedirectPath()} replace={true} />
  }
  return <Login />
}

export const router = createBrowserRouter([
  {
    element: <BaseTemplate />,
    children: [
      {
        index: true,
        path: '/',
        element: <Navigate to={getDefaultRedirectPath()} replace={true} />
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute element={<DashboardLayout />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'category',
        element: <ProtectedRoute element={<CategoryLayout />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'user',
        element: <ProtectedRoute element={<UserLayout />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'book',
        element: <ProtectedRoute element={<BookLayout />} allowedRoles={['ADMIN']} />
      },
      {
        path: 'setting',
        element: <ProtectedRoute element={<SettingLayout />} allowedRoles={['ADMIN']} />
      }
    ]
  },
  {
    path: 'login',
    element: <LoginWrapper />
  },
  {
    path: '*',
    element: <NotFound />
  }
])
