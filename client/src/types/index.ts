export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketCategory = 'hardware' | 'software' | 'network' | 'access'

export interface Ticket {
  id: string
  title: string
  requester: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignee: string
  createdAt: string
  description: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  sentAt: string
  isMine: boolean
}

export interface Conversation {
  id: string
  participantName: string
  participantInitials: string
  ticketId: string
  ticketTitle: string
  isOnline: boolean
  lastMessage: string
  unread: number
  messages: ChatMessage[]
}

export type AssetStatus = 'online' | 'offline' | 'warning'
export type AssetType = 'workstation' | 'server' | 'network' | 'mobile'

export interface Asset {
  id: string
  name: string
  type: AssetType
  status: AssetStatus
  specs: Record<string, string>
  healthPercent: number
}

export type VaultCategory = 'infra' | 'access' | 'network' | 'database'

export interface VaultEntry {
  id: string
  name: string
  username: string
  password: string
  category: VaultCategory
  url?: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  action: string
  actor: string
  actorRole: string
  timestamp: string
  severity: 'info' | 'warning' | 'danger'
}

export type NavRoute = 'dashboard' | 'tickets' | 'chat' | 'assets' | 'vault' | 'audit'
