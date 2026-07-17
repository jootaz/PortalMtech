import { useState } from 'react'
import { CONVERSATIONS } from '@/data/mockData'

export function useChat() {
  const [activeConvId, setActiveConvId] = useState(CONVERSATIONS[0].id)

  const activeConversation = CONVERSATIONS.find((c) => c.id === activeConvId)!

  return {
    conversations: CONVERSATIONS,
    activeConvId,
    setActiveConvId,
    activeConversation,
  }
}
