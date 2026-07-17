import { useState, useMemo } from 'react'
import { TICKETS } from '@/data/mockData'
import type { Ticket, TicketStatus } from '@/types'

type FilterTab = 'all' | TicketStatus

export function useTickets() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = useMemo<Ticket[]>(() => {
    if (activeFilter === 'all') return TICKETS
    return TICKETS.filter((t) => t.status === activeFilter)
  }, [activeFilter])

  const counts = useMemo(
    () => ({
      all: TICKETS.length,
      open: TICKETS.filter((t) => t.status === 'open').length,
      in_progress: TICKETS.filter((t) => t.status === 'in_progress').length,
      closed: TICKETS.filter((t) => t.status === 'closed').length,
    }),
    [],
  )

  return { filtered, activeFilter, setActiveFilter, counts }
}
