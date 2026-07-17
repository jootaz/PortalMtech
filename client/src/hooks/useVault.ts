import { useState, useMemo } from 'react'
import { VAULT_ENTRIES } from '@/data/mockData'
import type { VaultCategory } from '@/types'
import { useApp } from '@/context/AppContext'

type VaultFilter = 'all' | VaultCategory

export function useVault() {
  const { showToast } = useApp()
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('all')
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return VAULT_ENTRIES
    return VAULT_ENTRIES.filter((e) => e.category === activeFilter)
  }, [activeFilter])

  const toggleReveal = (id: string, name: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        showToast(`Senha revelada — ação registrada no log`)
      }
      return next
    })
  }

  const copyUsername = (name: string) => {
    showToast(`Usuário copiado — ${name}`)
  }

  const copyPassword = (name: string) => {
    showToast(`Senha copiada — ação registrada no log`)
  }

  return {
    filtered,
    activeFilter,
    setActiveFilter,
    revealedIds,
    toggleReveal,
    copyUsername,
    copyPassword,
  }
}
