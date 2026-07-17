import { LayoutDashboard, ClipboardList, MessageSquare, Monitor, Lock, ShieldCheck, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '@/context/AppContext'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { TICKETS, CONVERSATIONS } from '@/data/mockData'
import type { NavRoute } from '@/types'

interface NavItem {
  route: NavRoute
  label: string
  icon: React.ElementType
  badge?: number
  minRole?: UserRole
}

const MAIN_NAV: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'tickets', label: 'Chamados', icon: ClipboardList, badge: TICKETS.filter((t) => t.status === 'open').length },
  { route: 'chat', label: 'Chat', icon: MessageSquare, badge: CONVERSATIONS.reduce((a, c) => a + c.unread, 0) },
  { route: 'assets', label: 'Ativos de TI', icon: Monitor, minRole: 'technician' },
]

const SECURITY_NAV: NavItem[] = [
  { route: 'vault', label: 'Cofre de senhas', icon: Lock, minRole: 'admin' },
  { route: 'audit', label: 'Log de auditoria', icon: ShieldCheck, minRole: 'admin' },
]

const ROLE_LEVEL: Record<UserRole, number> = { user: 0, technician: 1, admin: 2 }

function hasMinRole(userRole: UserRole, minRole?: UserRole) {
  return !minRole || ROLE_LEVEL[userRole] >= ROLE_LEVEL[minRole]
}

export function Sidebar() {
  const { currentRoute, navigate } = useApp()
  const { user } = useAuth()
  const role = user?.role ?? 'user'

  const visibleMain = MAIN_NAV.filter((i) => hasMinRole(role, i.minRole))
  const visibleSecurity = SECURITY_NAV.filter((i) => hasMinRole(role, i.minRole))

  return (
    <aside className="w-56 bg-surface-1 border-r border-gray-100 flex flex-col flex-shrink-0 h-screen">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-none">HelpDesk TI</p>
          <p className="text-xs text-gray-400 mt-0.5">Portal interno</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <NavSection label="Principal" items={visibleMain} currentRoute={currentRoute} onNavigate={navigate} />
        {visibleSecurity.length > 0 && (
          <NavSection label="Segurança" items={visibleSecurity} currentRoute={currentRoute} onNavigate={navigate} />
        )}
      </nav>

      <SidebarFooter />
    </aside>
  )
}

function NavSection({ label, items, currentRoute, onNavigate }: {
  label: string; items: NavItem[]; currentRoute: NavRoute; onNavigate: (r: NavRoute) => void
}) {
  return (
    <div className="pt-4">
      <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button key={item.route} onClick={() => onNavigate(item.route)}
            className={clsx('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              currentRoute === item.route ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}>
            <Icon size={16} className="flex-shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {!!item.badge && item.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{item.badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function SidebarFooter() {
  const { user, logout } = useAuth()
  const initials = user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '??'
  const roleLabel: Record<string, string> = { admin: 'Administrador', technician: 'Técnico de TI', user: 'Usuário' }

  return (
    <div className="p-2 border-t border-gray-100">
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg group">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-400">{roleLabel[user?.role ?? 'user']}</p>
        </div>
        <button onClick={logout} className="opacity-0 group-hover:opacity-100 transition-opacity btn-icon flex-shrink-0" aria-label="Sair">
          <LogOut size={14} />
        </button>
      </div>
    </div>
  )
}
