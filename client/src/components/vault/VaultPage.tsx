import { useState, useMemo } from 'react'
import {
  Plus, Search, User, Copy, Eye, EyeOff,
  Server, Globe, Database, Shield, Wifi,
  LayoutGrid, RefreshCw, Pencil, Trash2,
  FileText, Link, Upload, BookOpen, GraduationCap, ClipboardList, FolderOpen,
} from 'lucide-react'
import clsx from 'clsx'
import { useVault } from '@/hooks/useVault'
import { VAULT_ICON_CLASS } from '@/utils/helpers'
import type { VaultEntry, VaultCategory, VaultDocument, DocumentCategory } from '@/types'

const CATEGORY_ICONS: Record<VaultCategory, React.ElementType> = {
  infra: Server,
  access: Globe,
  database: Database,
  network: Wifi,
}

const DOC_CATEGORY_ICON: Record<DocumentCategory, React.ElementType> = {
  manual: BookOpen,
  training: GraduationCap,
  procedure: ClipboardList,
  other: FolderOpen,
}

const DOC_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  manual: 'Manual',
  training: 'Treinamento',
  procedure: 'Procedimento',
  other: 'Outro',
}

const DOC_CATEGORY_CLASS: Record<DocumentCategory, string> = {
  manual: 'bg-blue-50 text-blue-700',
  training: 'bg-green-50 text-green-700',
  procedure: 'bg-amber-50 text-amber-700',
  other: 'bg-gray-50 text-gray-700',
}

const SIDEBAR_ITEMS: { key: 'all' | VaultCategory; label: string; Icon: React.ElementType }[] = [
  { key: 'all', label: 'Todos', Icon: LayoutGrid },
  { key: 'infra', label: 'Infraestrutura', Icon: Server },
  { key: 'access', label: 'Acessos', Icon: Globe },
  { key: 'database', label: 'Bancos de dados', Icon: Database },
  { key: 'network', label: 'Redes', Icon: Wifi },
]

type ActiveTab = 'passwords' | 'documents'

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
    documents,
    addDocument,
    deleteDocument,
  } = useVault()

  const [activeTab, setActiveTab] = useState<ActiveTab>('passwords')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<VaultEntry | null>(null)
  const [isDocModalOpen, setIsDocModalOpen] = useState(false)

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

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return documents
    const q = search.toLowerCase()
    return documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description ?? '').toLowerCase().includes(q),
    )
  }, [documents, search])

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 pb-0">
          <button
            onClick={() => setActiveTab('passwords')}
            className={clsx(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'passwords'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            Senhas
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={clsx(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
          >
            Documentos / Treinamentos
            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-semibold">
              {documents.length}
            </span>
          </button>
        </div>

        {activeTab === 'passwords' ? (
          <div className="flex gap-5 flex-1">
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
                      activeFilter === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100',
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
              {weakCount > 0 && (
                <div className="mt-5 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-xs font-semibold text-red-700">{weakCount} senha{weakCount > 1 ? 's fracas' : ' fraca'}</p>
                  <p className="text-[11px] text-red-400 mt-0.5">Considere atualizar</p>
                </div>
              )}
            </aside>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
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
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="field-input pl-8"
                  placeholder="Buscar documentos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-primary flex-shrink-0" onClick={() => setIsDocModalOpen(true)}>
                <Plus size={14} />
                Adicionar
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto">
              {filteredDocs.length === 0 && (
                <p className="text-sm text-gray-400 py-8 text-center">Nenhum documento encontrado.</p>
              )}
              {filteredDocs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  onDelete={() => deleteDocument(doc.id, doc.title)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <EntryModal
          initial={editEntry}
          onClose={() => setIsModalOpen(false)}
          onSave={(entry) => {
            if (editEntry) updateEntry(entry)
            else addEntry(entry)
            setIsModalOpen(false)
          }}
        />
      )}

      {isDocModalOpen && (
        <DocumentModal
          onClose={() => setIsDocModalOpen(false)}
          onSave={(doc) => {
            addDocument(doc)
            setIsDocModalOpen(false)
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
            <button className="btn-icon border-red-200 bg-red-50 text-red-600 hover:bg-red-100" onClick={onDelete} title="Confirmar exclusão">
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
    </div>
  )
}

function DocumentRow({ doc, onDelete }: { doc: VaultDocument; onDelete: () => void }) {
  const Icon = DOC_CATEGORY_ICON[doc.category]
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
        {doc.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>}
        <p className="text-[11px] text-gray-300 mt-0.5">
          {doc.fileName ? `${doc.fileName} · ${doc.fileSize}` : 'Link externo'}
          {' · '}{doc.uploadedBy} · {doc.createdAt}
        </p>
      </div>
      <span className={`badge ${DOC_CATEGORY_CLASS[doc.category]}`}>
        {DOC_CATEGORY_LABEL[doc.category]}
      </span>
      <div className="flex gap-1.5 flex-shrink-0">
        {doc.url && (
          <a href={doc.url} target="_blank" rel="noreferrer" className="btn-icon" title="Abrir link">
            <Link size={14} />
          </a>
        )}
        {doc.fileName && (
          <button className="btn-icon" title="Baixar arquivo">
            <FileText size={14} />
          </button>
        )}
        {confirmDelete ? (
          <>
            <button className="btn-icon border-red-200 bg-red-50 text-red-600 hover:bg-red-100" onClick={onDelete} title="Confirmar exclusão">
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
    </div>
  )
}

interface EntryModalProps {
  initial: VaultEntry | null
  onClose: () => void
  onSave: (entry: VaultEntry) => void
}

function EntryModal({ initial, onClose, onSave }: EntryModalProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<VaultCategory>(initial?.category ?? 'infra')
  const [username, setUsername] = useState(initial?.username ?? '')
  const [password, setPassword] = useState(initial?.password ?? '')
  const [url, setUrl] = useState(initial?.url ?? '')
  const [showPassword, setShowPassword] = useState(false)

  const handleSave = () => {
    if (!name.trim() || !username.trim() || !password.trim()) return
    onSave({
      id: initial?.id ?? `v${Date.now()}`,
      name: name.trim(),
      username: username.trim(),
      password: password.trim(),
      category,
      url: url.trim() || undefined,
      updatedAt: 'Agora mesmo',
    })
  }

  const CATEGORY_OPTIONS: { value: VaultCategory; label: string }[] = [
    { value: 'infra', label: 'Infraestrutura' },
    { value: 'access', label: 'Acesso' },
    { value: 'network', label: 'Rede' },
    { value: 'database', label: 'Banco de dados' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl border border-gray-100 w-[460px]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{initial ? 'Editar entrada' : 'Nova entrada'}</h2>
          <button className="btn-icon" onClick={onClose}><Plus size={14} className="rotate-45" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="field-label">Nome / descrição</label>
            <input className="field-input" placeholder="Ex: Firewall — Cisco ASA" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Categoria</label>
            <select className="field-input" value={category} onChange={(e) => setCategory(e.target.value as VaultCategory)}>
              {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Usuário / login</label>
            <input className="field-input" placeholder="admin" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Senha</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="field-input pr-9"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button className="btn flex-shrink-0" type="button" onClick={() => { setPassword(generatePassword()); setShowPassword(true) }}>
                <RefreshCw size={13} />
                Gerar
              </button>
            </div>
          </div>
          <div>
            <label className="field-label">Endereço / URL (opcional)</label>
            <input className="field-input" placeholder="192.168.1.1" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !username.trim() || !password.trim()}>
            <Shield size={13} />
            Salvar entrada
          </button>
        </div>
      </div>
    </div>
  )
}

function DocumentModal({ onClose, onSave }: { onClose: () => void; onSave: (doc: VaultDocument) => void }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<DocumentCategory>('manual')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize] = useState('')
  const [uploadType, setUploadType] = useState<'link' | 'file'>('link')

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: `d${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || undefined,
      url: uploadType === 'link' ? url.trim() || undefined : undefined,
      fileName: uploadType === 'file' ? fileName.trim() || undefined : undefined,
      fileSize: uploadType === 'file' ? fileSize.trim() || undefined : undefined,
      uploadedBy: 'Jadir Freire',
      createdAt: 'Agora mesmo',
    })
  }

  const DOC_OPTIONS: { value: DocumentCategory; label: string }[] = [
    { value: 'manual', label: 'Manual' },
    { value: 'training', label: 'Treinamento' },
    { value: 'procedure', label: 'Procedimento' },
    { value: 'other', label: 'Outro' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl border border-gray-100 w-[460px]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Adicionar documento</h2>
          <button className="btn-icon" onClick={onClose}><Plus size={14} className="rotate-45" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="field-label">Título</label>
            <input className="field-input" placeholder="Ex: Manual de Segurança" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Categoria</label>
            <select className="field-input" value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)}>
              {DOC_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Descrição (opcional)</label>
            <input className="field-input" placeholder="Breve descrição do documento" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadType('link')}
                className={clsx('btn flex-1 justify-center', uploadType === 'link' && 'btn-primary')}
              >
                <Link size={13} />
                Link externo
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={clsx('btn flex-1 justify-center', uploadType === 'file' && 'btn-primary')}
              >
                <Upload size={13} />
                Arquivo
              </button>
            </div>
          </div>
          {uploadType === 'link' ? (
            <div>
              <label className="field-label">URL</label>
              <input className="field-input" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          ) : (
            <div>
              <label className="field-label">Nome do arquivo</label>
              <input className="field-input" placeholder="documento.pdf" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!title.trim()}>
            <Shield size={13} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}