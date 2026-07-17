import { TICKETS, AUDIT_LOGS } from '@/data/mockData'
import {
  TICKET_STATUS_CLASS,
  TICKET_STATUS_LABEL,
  TICKET_PRIORITY_COLOR,
  getSlaColor,
  getSlaPctClass,
} from '@/utils/helpers'

const SLA_DATA = [
  { label: 'Rede', percent: 92 },
  { label: 'Hardware', percent: 78 },
  { label: 'Software', percent: 85 },
  { label: 'Acesso', percent: 61 },
]

const BAR_DATA = [
  { day: 'Seg', height: 45 },
  { day: 'Ter', height: 78 },
  { day: 'Qua', height: 62 },
  { day: 'Qui', height: 88 },
  { day: 'Sex', height: 55 },
  { day: 'Sáb', height: 28 },
  { day: 'Hoje', height: 42, isToday: true },
]

const TECHNICIANS = [
  { name: 'João Carlos', initials: 'JC', count: 9, percent: 75, color: 'bg-blue-500' },
  { name: 'Maria Oliveira', initials: 'MO', count: 6, percent: 50, color: 'bg-purple-500' },
  { name: 'Roberto Faria', initials: 'RF', count: 4, percent: 33, color: 'bg-green-500' },
]

export function DashboardPage() {
  const recentTickets = TICKETS.slice(0, 3)

  return (
    <div className="space-y-5">
      <MetricsGrid />
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 card">
          <p className="text-sm font-semibold text-gray-900 mb-4">Chamados por dia — últimos 7 dias</p>
          <BarChart />
        </div>
        <div className="col-span-2 card">
          <p className="text-sm font-semibold text-gray-900 mb-4">SLA por categoria</p>
          <SlaChart />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm font-semibold text-gray-900 mb-4">Chamados recentes</p>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${TICKET_PRIORITY_COLOR[ticket.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    #{ticket.id} – {ticket.title}
                  </p>
                  <p className="text-xs text-gray-400">{ticket.requester} · {ticket.createdAt}</p>
                </div>
                <span className={`badge ${TICKET_STATUS_CLASS[ticket.status]}`}>
                  {TICKET_STATUS_LABEL[ticket.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="text-sm font-semibold text-gray-900 mb-4">Distribuição por técnico</p>
          <div className="space-y-4">
            {TECHNICIANS.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                  {tech.initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">{tech.name}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className={`h-full rounded-full ${tech.color}`} style={{ width: `${tech.percent}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-4 text-right">{tech.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricsGrid() {
  const metrics = [
    { label: 'Chamados abertos', value: 7, sub: '↑ 2 novos hoje', valueClass: 'text-red-600', subClass: 'text-red-500' },
    { label: 'Em andamento', value: 12, sub: '3 com SLA em risco', valueClass: 'text-amber-600', subClass: 'text-gray-400' },
    { label: 'Concluídos hoje', value: 9, sub: '↑ 40% vs ontem', valueClass: 'text-green-600', subClass: 'text-green-500' },
    { label: 'Tempo médio (min)', value: 38, sub: '↓ 12% esta semana', valueClass: 'text-gray-900', subClass: 'text-green-500' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="card">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{m.label}</p>
          <p className={`text-3xl font-bold tracking-tight ${m.valueClass}`}>{m.value}</p>
          <p className={`text-xs mt-1.5 ${m.subClass}`}>{m.sub}</p>
        </div>
      ))}
    </div>
  )
}

function BarChart() {
  return (
    <div className="flex items-end gap-2 h-20">
      {BAR_DATA.map(({ day, height, isToday }) => (
        <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div
            className={`w-full rounded-t-sm ${isToday ? 'bg-blue-500' : 'bg-blue-200'}`}
            style={{ height: `${height}%` }}
          />
          <span className={`text-[10px] ${isToday ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            {day}
          </span>
        </div>
      ))}
    </div>
  )
}

function SlaChart() {
  return (
    <div className="space-y-3">
      {SLA_DATA.map(({ label, percent }) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 w-16 flex-shrink-0">{label}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
            <div
              className={`h-full rounded-full ${getSlaColor(percent)}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className={`text-xs font-semibold w-8 text-right ${getSlaPctClass(percent)}`}>
            {percent}%
          </span>
        </div>
      ))}
    </div>
  )
}
