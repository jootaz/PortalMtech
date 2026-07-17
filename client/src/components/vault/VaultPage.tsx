import { useState } from 'react'
import { Plus, User, Copy, Eye, EyeOff, Server, Globe, Database, Shield, Wifi } from 'lucide-react'
import clsx from 'clsx'
import { useVault } from '@/hooks/useVault'
import { VAULT_ENTRIES } from '@/data/mockData'
import {
  VAULT_CATEGORY_LABEL,
  VAULT_CATEGORY_CLASS,
  VAULT_ICON_CLASS,
} from '@/utils/helpers'
import type { VaultEntry, VaultCategory } from '@/types'

type VaultFilter = 'all' | VaultCategory

const FILTER_TABS: { key: VaultFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'infra', label: 'Infraestrutura' },
  { key: 'access', label: 'Acessos' },
  { key: 'network', label: 'Rede' },
  { key: 'database', label: 'Bancos de dados' },
]

const CATEGORY_ICONS: Record<VaultCategory, React.ElementType> = {
  infra: Server,
  access: Globe,
  database: Database,
  network: Wifi,
}

const VAULT_STATS = [
  { label: 'Entradas salvas', value: VAULT_ENTRIES.length },
  { label: 'Acessos hoje', value: 6 },
  { label: 'Senhas fracas', value: 1, danger: true },
]

export function VaultPage() {
  const {
    filtered,
    activeFilter,
    setActiveFilter,
    revealedIds,
    toggleReveal,
    copyUsername,
    copyPassword,
  } = useVault()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {VAULT_STATS.map(({ label, value, danger }) => (
            <div key={label} className="card">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-2xl font-bold tracking-tight ${danger ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  activeFilter === key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} />
            Nova entrada
          </button>
        </div>

        {/* Entry list */}
        <div className="space-y-2">
          {filtered.map((entry) => (
            <VaultEntryRow
              key={entry.id}
              entry={entry}
              isRevealed={revealedIds.has(entry.id)}
              onReveal={() => toggleReveal(entry.id, entry.name)}
              onCopyUser={() => copyUsername(entry.name)}
              onCopyPwd={() => copyPassword(entry.name)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && <NewEntryModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

interface VaultEntryRowProps {
  entry: VaultEntry
  isRevealed: boolean
  onReveal: () => void
  onCopyUser: () => void
  onCopyPwd: () => void
}

function VaultEntryRow({ entry, isRevealed, onReveal, onCopyUser, onCopyPwd }: VaultEntryRowProps) {
  const Icon = CATEGORY_ICONS[entry.category]

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${VAULT_ICON_CLASS[entry.category]}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{entry.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {entry.username}
          {entry.url && <span> · {entry.url}</span>}
          {' · '}
          <span className="font-mono tracking-widest">{isRevealed ? 'Senha visível' : '••••••••••••'}</span>
        </p>
      </div>
      <span className={`badge ${VAULT_CATEGORY_CLASS[entry.category]}`}>
        {VAULT_CATEGORY_LABEL[entry.category]}
      </span>
      <div className="flex gap-1.5 flex-shrink-0">
        <button className="btn-icon" onClick={onCopyUser} title="Copiar usuário">
          <User size={13} />
        </button>
        <button className="btn-icon" onClick={onCopyPwd} title="Copiar senha">
          <Copy size={13} />
        </button>
        <button className="btn-icon" onClick={onReveal} title={isRevealed ? 'Ocultar senha' : 'Revelar senha'}>
          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
      <span className="text-[10px] text-gray-400 flex-shrink-0 w-24 text-right">{entry.updatedAt}</span>
    </div>
  )
}

function NewEntryModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl border border-gray-100 w-[460px]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Nova entrada</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <Plus size={14} className="rotate-45" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="field-label">Nome / descrição</label>
            <input className="field-input" placeholder="Ex: Firewall — Cisco ASA" />
          </div>
          <div>
            <label className="field-label">Categoria</label>
            <select className="field-input">
              <option>Infraestrutura</option>
              <option>Acesso</option>
              <option>Rede</option>
              <option>Banco de dados</option>
            </select>
          </div>
          <div>
            <label className="field-label">Usuário / login</label>
            <input className="field-input" placeholder="admin" />
          </div>
          <div>
            <label className="field-label">Senha</label>
            <div className="flex gap-2">
              <input className="field-input flex-1" type="password" placeholder="••••••••••••" />
              <button className="btn" title="Gerar senha forte">Gerar</button>
            </div>
          </div>
          <div>
            <label className="field-label">Endereço / URL (opcional)</label>
            <input className="field-input" placeholder="192.168.1.1" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onClose}>
            <Shield size={13} />
            Salvar entrada
          </button>
        </div>
      </div>
    </div>
  )
}
