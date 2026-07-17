import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react'

export type UserRole = 'admin' | 'technician' | 'user'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  login: () => void
  logout: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    fetch('/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(({ user }) => { setUser(user); setStatus('authenticated') })
      .catch(() => setStatus('unauthenticated'))
  }, [])

  const login = useCallback(() => { window.location.href = '/auth/login' }, [])

  const logout = useCallback(async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const hasRole = useCallback(
    (...roles: UserRole[]) => !!user && roles.includes(user.role),
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, status, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
