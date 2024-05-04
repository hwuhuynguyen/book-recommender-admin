import { createBrowserRouter, Navigate } from 'react-router-dom'
import BaseTemplate from '../templates/base.template'
import ProtectedRoute from './ProtectedRoute'
import UserLayout from '../layouts/User'
import BookLayout from '../layouts/Book'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import DashboardLayout from '../layouts/Dashboard'
import SettingLayout from '../layouts/Settings'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

const LoginWrapper = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)
  if (accessToken) {
    return <Navigate to={'/dashboard'} replace={true} />
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
        element: <Navigate to={'/dashboard'} replace={true} />
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute element={<DashboardLayout />} allowedRoles={['ADMIN']} />
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
