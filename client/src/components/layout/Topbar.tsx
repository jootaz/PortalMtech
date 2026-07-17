import { Bell, Settings, Search } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { NavRoute } from '@/types'

const ROUTE_TITLES: Record<NavRoute, string> = {
  dashboard: 'Dashboard',
  tickets: 'Chamados',
  chat: 'Chat em tempo real',
  assets: 'Ativos de TI',
  vault: 'Cofre de senhas',
  audit: 'Log de auditoria',
}

export function Topbar() {
  const { currentRoute } = useApp()

  return (
    <header className="h-14 bg-surface-1 border-b border-gray-100 flex items-center px-6 gap-3 flex-shrink-0">
      <h1 className="text-[15px] font-semibold text-gray-900 flex-1 tracking-tight">
        {ROUTE_TITLES[currentRoute]}
      </h1>

      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 w-52">
        <Search size={13} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-400">Buscar...</span>
      </div>

      <button className="btn-icon" aria-label="Notificações">
        <Bell size={15} />
      </button>

      <button className="btn-icon" aria-label="Configurações">
        <Settings size={15} />
      </button>

      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold">
        JC
      </div>
    </header>
  )
}
