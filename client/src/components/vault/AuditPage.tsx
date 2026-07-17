import clsx from 'clsx'
import { AUDIT_LOGS } from '@/data/mockData'
import type { AuditLog } from '@/types'

const SEVERITY_DOT: Record<AuditLog['severity'], string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

const TODAY_LOGS = AUDIT_LOGS.filter((l) => l.timestamp.startsWith('Hoje'))
const YESTERDAY_LOGS = AUDIT_LOGS.filter((l) => l.timestamp.startsWith('Ontem'))

export function AuditPage() {
  return (
    <div className="space-y-6">
      <AuditSection title="Hoje" logs={TODAY_LOGS} />
      <AuditSection title="Ontem" logs={YESTERDAY_LOGS} />
    </div>
  )
}

function AuditSection({ title, logs }: { title: string; logs: AuditLog[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="space-y-2">
        {logs.map((log) => (
          <AuditItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}

function AuditItem({ log }: { log: AuditLog }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 flex items-center gap-3">
      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', SEVERITY_DOT[log.severity])} />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{log.action}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {log.actor} · {log.actorRole}
        </p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{log.timestamp}</span>
    </div>
  )
}
