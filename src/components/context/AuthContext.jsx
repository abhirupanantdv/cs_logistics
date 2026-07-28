//AuthContext.jsx
import { createContext, useEffect, useState } from 'react'
import * as authService from '@/services/authService'
import { clearAuth, getToken, getUser, setAuth } from '@/utils/storage'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async (email, password) => {
  const result = await authService.login(email, password)

  setAuth(result.token, result.user)
  setUser(result.user)

  return result
}

  const logout = async () => {
    await authService.logout()
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!getToken(),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}