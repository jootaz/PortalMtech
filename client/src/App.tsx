import { AuthProvider } from '@/context/AuthContext'
import { AppProvider, useApp } from '@/context/AppContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ToastContainer } from '@/components/layout/ToastContainer'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { TicketsPage } from '@/components/tickets/TicketsPage'
import { ChatPage } from '@/components/chat/ChatPage'
import { AssetsPage } from '@/components/assets/AssetsPage'
import { VaultPage } from '@/components/vault/VaultPage'
import { AuditPage } from '@/components/vault/AuditPage'
import type { NavRoute } from '@/types'
import type { UserRole } from '@/context/AuthContext'

const PAGE_MAP: Record<NavRoute, React.ElementType> = {
  dashboard: DashboardPage,
  tickets: TicketsPage,
  chat: ChatPage,
  assets: AssetsPage,
  vault: VaultPage,
  audit: AuditPage,
}

// Papéis mínimos por rota — rotas não listadas são acessíveis a qualquer autenticado
const ROUTE_ROLES: Partial<Record<NavRoute, UserRole[]>> = {
  assets: ['admin', 'technician'],
  vault: ['admin'],
  audit: ['admin'],
}

function AppShell() {
  const { currentRoute } = useApp()
  const Page = PAGE_MAP[currentRoute]
  const roles = ROUTE_ROLES[currentRoute]

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-surface-0">
          <ProtectedRoute roles={roles}>
            <Page />
          </ProtectedRoute>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </ProtectedRoute>
    </AuthProvider>
  )
}
