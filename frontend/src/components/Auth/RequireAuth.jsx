import React from 'react'
import { Navigate } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (!token) {
    return <Navigate to="/mcn-admin/login" replace />
  }
  return children
}

export default RequireAuth


