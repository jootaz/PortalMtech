import type {
  TicketStatus,
  TicketPriority,
  TicketCategory,
  AssetStatus,
  AssetType,
  VaultCategory,
} from '@/types'

// ── Ticket helpers ────────────────────────────────────────────────────────────

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  closed: 'Concluído',
}

export const TICKET_STATUS_CLASS: Record<TicketStatus, string> = {
  open: 'bg-red-50 text-red-700',
  in_progress: 'bg-amber-50 text-amber-700',
  closed: 'bg-green-50 text-green-700',
}

export const TICKET_PRIORITY_COLOR: Record<TicketPriority, string> = {
  low: 'bg-green-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
  critical: 'bg-red-700',
}

export const TICKET_CATEGORY_LABEL: Record<TicketCategory, string> = {
  hardware: 'Hardware',
  software: 'Software',
  network: 'Rede',
  access: 'Acesso',
}

// ── Asset helpers ─────────────────────────────────────────────────────────────

export const ASSET_STATUS_LABEL: Record<AssetStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Alerta',
}

export const ASSET_STATUS_CLASS: Record<AssetStatus, string> = {
  online: 'bg-green-50 text-green-700',
  offline: 'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700',
}

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  workstation: 'Estação de trabalho',
  server: 'Servidor',
  network: 'Equipamento de rede',
  mobile: 'Dispositivo móvel',
}

export const ASSET_TYPE_ICON_CLASS: Record<AssetType, string> = {
  workstation: 'bg-blue-50 text-blue-600',
  server: 'bg-green-50 text-green-600',
  network: 'bg-amber-50 text-amber-600',
  mobile: 'bg-purple-50 text-purple-600',
}

// ── Vault helpers ─────────────────────────────────────────────────────────────

export const VAULT_CATEGORY_LABEL: Record<VaultCategory, string> = {
  infra: 'Infra',
  access: 'Acesso',
  network: 'Rede',
  database: 'Banco de dados',
}

export const VAULT_CATEGORY_CLASS: Record<VaultCategory, string> = {
  infra: 'bg-purple-50 text-purple-700',
  access: 'bg-blue-50 text-blue-700',
  network: 'bg-green-50 text-green-700',
  database: 'bg-red-50 text-red-700',
}

export const VAULT_ICON_CLASS: Record<VaultCategory, string> = {
  infra: 'bg-green-50 text-green-600',
  access: 'bg-blue-50 text-blue-600',
  network: 'bg-amber-50 text-amber-600',
  database: 'bg-red-50 text-red-600',
}

// ── Health bar helpers ────────────────────────────────────────────────────────

export function getHealthColor(percent: number): string {
  if (percent >= 85) return 'bg-green-500'
  if (percent >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getHealthTextColor(percent: number): string {
  if (percent >= 85) return 'text-green-600'
  if (percent >= 70) return 'text-amber-600'
  return 'text-red-600'
}

// ── SLA bar helpers ───────────────────────────────────────────────────────────

export function getSlaColor(percent: number): string {
  if (percent >= 85) return 'bg-green-500'
  if (percent >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getSlaPctClass(percent: number): string {
  if (percent >= 85) return 'text-green-600'
  if (percent >= 70) return 'text-amber-600'
  return 'text-red-600'
}
