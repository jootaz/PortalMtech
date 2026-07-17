import {
  createContext, useContext, useState, useCallback, useRef, type ReactNode,
} from 'react'
import type { NavRoute } from '@/types'

interface Toast { id: number; message: string }

interface AppContextValue {
  currentRoute: NavRoute
  navigate: (route: NavRoute) => void
  toasts: Toast[]
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard')
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const navigate = useCallback((route: NavRoute) => setCurrentRoute(route), [])

  const showToast = useCallback((message: string) => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500)
  }, [])

  return (
    <AppContext.Provider value={{ currentRoute, navigate, toasts, showToast }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
