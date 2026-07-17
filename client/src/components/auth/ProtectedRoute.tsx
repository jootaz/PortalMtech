import type { ReactNode } from 'react'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { LoginPage } from '@/components/auth/LoginPage'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { status, hasRole } = useAuth()

  if (status === 'loading') return <LoadingScreen />
  if (status === 'unauthenticated') return <LoginPage />
  if (roles && !hasRole(...roles)) return <AccessDeniedScreen />

  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )
}

function AccessDeniedScreen() {
  const { logout } = useAuth()
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-10 w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Acesso negado</h2>
        <p className="text-sm text-gray-400 mb-8">Sua conta não tem permissão para acessar esta área.</p>
        <button onClick={logout} className="btn w-full justify-center">Sair e trocar de conta</button>
      </div>
    </div>
  )
}
