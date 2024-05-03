import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../redux/store'

type ProtectedRouteProps = {
  element: ReactNode
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const userRole = useSelector((state: RootState) => state.auth.userRole)
  const isLoggedIn = !!useSelector((state: RootState) => state.auth.accessToken)
  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  if (allowedRoles.includes(userRole || '')) {
    return <>{element}</>
  } else {
    return <Navigate to="/*" replace />
  }
}

export default ProtectedRoute
