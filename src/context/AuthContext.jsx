import { createContext, useContext, useState } from 'react'

// NOTE: This is a front-end-only demo login (no real backend/API).
// Change these credentials before using this in production, and connect
// a real authentication backend for anything beyond a demo/admin preview.
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'ctn-admin-2026'
const SESSION_KEY = 'ctn_admin_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(
    () => localStorage.getItem(SESSION_KEY) === 'true',
  )

  function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true')
      setIsAuthed(true)
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setIsAuthed(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
