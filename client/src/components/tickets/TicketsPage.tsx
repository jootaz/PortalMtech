import { useState } from 'react'
import { Filter, Plus, Pencil } from 'lucide-react'
import clsx from 'clsx'
import { useTickets } from '@/hooks/useTickets'
import {
  TICKET_STATUS_LABEL,
  TICKET_STATUS_CLASS,
  TICKET_PRIORITY_COLOR,
  TICKET_CATEGORY_LABEL,
} from '@/utils/helpers'
import type { TicketStatus } from '@/types'

type FilterTab = 'all' | TicketStatus

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'open', label: 'Abertos' },
  { key: 'in_progress', label: 'Em andamento' },
  { key: 'closed', label: 'Concluídos' },
]

export function TicketsPage() {
  const { filtered, activeFilter, setActiveFilter, counts } = useTickets()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="space-y-4">
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
                <span className="ml-1.5 opacity-60">{counts[key]}</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="btn">
            <Filter size={13} />
            Filtrar
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} />
            Novo chamado
          </button>
        </div>

        {/* Ticket list */}
        <div className="space-y-2">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-gray-100 rounded-xl px-5 py-3.5
                         flex items-center gap-3 hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${TICKET_PRIORITY_COLOR[ticket.priority]}`} />
              <span className="text-[11px] font-mono text-gray-400 w-10 flex-shrink-0">
                #{ticket.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ticket.requester} · {TICKET_CATEGORY_LABEL[ticket.category]} · {ticket.assignee}
                </p>
              </div>
              <span className={`badge ${TICKET_STATUS_CLASS[ticket.status]}`}>
                {TICKET_STATUS_LABEL[ticket.status]}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0 w-20 text-right">
                {ticket.createdAt}
              </span>
              <button className="btn-icon flex-shrink-0" aria-label="Editar chamado">
                <Pencil size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && <NewTicketModal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl border border-gray-100 w-[480px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Novo chamado</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <Plus size={14} className="rotate-45" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="field-label">Título</label>
            <input className="field-input" placeholder="Descreva o problema brevemente" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Categoria</label>
              <select className="field-input">
                <option>Hardware</option>
                <option>Software</option>
                <option>Rede</option>
                <option>Acesso</option>
              </select>
            </div>
            <div>
              <label className="field-label">Prioridade</label>
              <select className="field-input">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Solicitante</label>
            <input className="field-input" placeholder="Nome do solicitante" />
          </div>
          <div>
            <label className="field-label">Descrição</label>
            <textarea className="field-input resize-none" rows={3} placeholder="Descreva o problema com detalhes..." />
          </div>
          <div>
            <label className="field-label">Técnico responsável</label>
            <select className="field-input">
              <option>João Carlos</option>
              <option>Maria Oliveira</option>
              <option>Roberto Faria</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onClose}>
            <Plus size={14} />
            Abrir chamado
          </button>
        </div>
      </div>
    </div>
  )
}
