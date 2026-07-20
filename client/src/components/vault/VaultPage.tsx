import { useState, useMemo } from 'react'
import {
  Plus, Search, User, Copy, Eye, EyeOff,
  Server, Globe, Database, Shield, Wifi,
  LayoutGrid, RefreshCw, Pencil, Trash2,
} from 'lucide-react'
import clsx from 'clsx'
import { useVault } from '@/hooks/useVault'
import {
  VAULT_ICON_CLASS,
} from '@/utils/helpers'
import type { VaultEntry, VaultCategory } from '@/types'

const CATEGORY_ICONS: Record<VaultCategory, React.ElementType> = {
  infra: Server,
  access: Globe,
  database: Database,
  network: Wifi,
}

const SIDEBAR_ITEMS: { key: 'all' | VaultCategory; label: string; Icon: React.ElementType }[] = [
  { key: 'all', label: 'Todos', Icon: LayoutGrid },
  { key: 'infra', label: 'Infraestrutura', Icon: Server },
  { key: 'access', label: 'Acessos', Icon: Globe },
  { key: 'database', label: 'Bancos de dados', Icon: Database },
  { key: 'network', label: 'Redes', Icon: Wifi },
]

function generatePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const digits = '0123456789'
  const special = '!@#$%&*'
  const all = upper + lower + digits + special
  const rand = (set: string) => set[Math.floor(Math.random() * set.length)]
  const base = [rand(upper), rand(lower), rand(digits), rand(special)]
  for (let i = 0; i < 10; i++) base.push(rand(all))
  return base.sort(() => Math.random() - 0.5).join('')
}

export function VaultPage() {
  const {
    entries,
    activeFilter,
    setActiveFilter,
    revealedIds,
    toggleReveal,
    copyUsername,
    copyPassword,
    addEntry,
    updateEntry,
    deleteEntry,
    weakCount,
  } = useVault()

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<VaultEntry | null>(null)

  const countByCategory = useMemo(() => {
    const map: Record<string, number> = { all: entries.length }
    entries.forEach((e) => {
      map[e.category] = (map[e.category] ?? 0) + 1
    })
    return map
  }, [entries])

  const filtered = useMemo(() => {
    let list = activeFilter === 'all' ? entries : entries.filter((e) => e.category === activeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.username.toLowerCase().includes(q) ||
          (e.url ?? '').toLowerCase().includes(q),
      )
    }
    return list
  }, [entries, activeFilter, search])

  return (
    <>
      <div className="flex gap-5 h-full">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Categorias</p>
          <nav className="space-y-0.5">
            {SIDEBAR_ITEMS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                <span className={clsx(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  activeFilter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                )}>
                  {countByCategory[key] ?? 0}
                </span>
              </button>
            ))}
          </nav>

          {/* Senhas fracas */}
          {weakCount > 0 && (
            <div className="mt-5 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-xs font-semibold text-red-700">{weakCount} senha{weakCount > 1 ? 's fracas' : ' fraca'}</p>
              <p className="text-[11px] text-red-400 mt-0.5">Considere atualizar</p>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="field-input pl-8"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary flex-shrink-0" onClick={() => { setEditEntry(null); setIsModalOpen(true) }}>
              <Plus size={14} />
              Nova
            </button>
          </div>

          {/* Entry list */}
          <div className="space-y-2 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">Nenhuma entrada encontrada.</p>
            )}
            {filtered.map((entry) => (
              <VaultEntryRow
                key={entry.id}
                entry={entry}
                isRevealed={revealedIds.has(entry.id)}
                onReveal={() => toggleReveal(entry.id, entry.name)}
                onCopyUser={() => copyUsername(entry)}
                onCopyPwd={() => copyPassword(entry)}
                onEdit={() => { setEditEntry(entry); setIsModalOpen(true) }}
                onDelete={() => deleteEntry(entry.id, entry.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EntryModal
          initial={editEntry}
          onClose={() => setIsModalOpen(false)}
          onSave={(entry) => {
            if (editEntry) {
              updateEntry(entry)
            } else {
              addEntry(entry)
            }
            setIsModalOpen(false)
          }}
        />
      )}
    </>
  )
}

interface VaultEntryRowProps {
  entry: VaultEntry
  isRevealed: boolean
  onReveal: () => void
  onCopyUser: () => void
  onCopyPwd: () => void
  onEdit: () => void
  onDelete: () => void
}

function VaultEntryRow({ entry, isRevealed, onReveal, onCopyUser, onCopyPwd, onEdit, onDelete }: VaultEntryRowProps) {
  const Icon = CATEGORY_ICONS[entry.category]
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${VAULT_ICON_CLASS[entry.category]}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{entry.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.username}</p>
      </div>

      <span className="font-mono text-sm text-gray-400 tracking-widest w-28 text-center flex-shrink-0 select-none">
        {isRevealed ? entry.password : '••••••••••'}
      </span>

      <div className="flex gap-1.5 flex-shrink-0">
        <button className="btn-icon" onClick={onReveal} title={isRevealed ? 'Ocultar' : 'Revelar'}>
          {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button className="btn-icon" onClick={onCopyPwd} title="Copiar senha">
          <Copy size={14} />
        </button>
        <button className="btn-icon" onClick={onCopyUser} title="Copiar usuário">
          <User size={14} />
        </button>
        <button className="btn-icon" onClick={onEdit} title="Editar">
          <Pencil size={14} />
        </button>
        {confirmDelete ? (
          <>
            <button
              className="btn-icon border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              onClick={onDelete}
              title="Confirmar exclusão"
            >
              <Trash2 size={14} />
            </button>
            <button className="btn-icon" onClick={() => setConfirmDelete(false)} title="Cancelar">
              <Plus size={14} className="rotate-45" />
            </button>
          </>
        ) : (
          <button className="btn-icon" onClick={() => setConfirmDelete(true)} title="Excluir">
            <Trash2 size={14} />
          </button>
        )}
      </div>