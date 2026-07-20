import { useState, useMemo } from 'react'
import type { VaultEntry, VaultCategory } from '@/types'
import { useApp } from '@/context/AppContext'
import { VAULT_ENTRIES } from '@/data/mockData'

type VaultFilter = 'all' | VaultCategory

export function useVault() {
  const { showToast } = useApp()
  const [activeFilter, setActiveFilter] = useState<VaultFilter>('all')
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [entries, setEntries] = useState<VaultEntry[]>(VAULT_ENTRIES)

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return entries
    return entries.filter((e) => e.category === activeFilter)
  }, [activeFilter, entries])

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

  const copyUsername = async (entry: VaultEntry) => {
    try {
      await navigator.clipboard.writeText(entry.username)
      showToast(`Usuário copiado — ${entry.name}`)
    } catch {
      showToast(`Erro ao copiar usuário`)
    }
  }

  const copyPassword = async (entry: VaultEntry) => {
    try {
      await navigator.clipboard.writeText(entry.password)
      showToast(`Senha copiada — ação registrada no log`)
    } catch {
      showToast(`Erro ao copiar senha`)
    }
  }

  const addEntry = (entry: VaultEntry) => {
    setEntries((prev) => [entry, ...prev])
    showToast(`Entrada "${entry.name}" salva no cofre`)
  }

  const updateEntry = (entry: VaultEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)))
    showToast(`Entrada "${entry.name}" atualizada`)
  }

  const deleteEntry = (id: string, name: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setRevealedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    showToast(`Entrada "${name}" removida`)
  }

  const weakCount = entries.filter((e) => e.password.length < 10).length

  return {
    entries,
    filtered,
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
  }
}