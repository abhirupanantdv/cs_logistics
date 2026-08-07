// RootRedirect.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function RootRedirect() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return (
    <Navigate
      to={
        isAuthenticated
          ? '/dashboard'
          : '/login'
      }
      replace
    />
  )
}