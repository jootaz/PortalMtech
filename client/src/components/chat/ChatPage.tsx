import { Send, Paperclip } from 'lucide-react'
import clsx from 'clsx'
import { useChat } from '@/hooks/useChat'
import type { Conversation, ChatMessage } from '@/types'

export function ChatPage() {
  const { conversations, activeConvId, setActiveConvId, activeConversation } = useChat()

  return (
    <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      <ConversationList
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
      />
      <ChatArea conversation={activeConversation} />
    </div>
  )
}

interface ConversationListProps {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
}

function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  return (
    <aside className="w-60 border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-4 py-3.5 border-b border-gray-100 text-sm font-semibold text-gray-900">
        Atendimentos ativos
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </aside>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors',
        isActive && 'bg-blue-50',
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', conversation.isOnline ? 'bg-green-500' : 'bg-gray-300')} />
        <span className="text-sm font-medium text-gray-900 flex-1 truncate">{conversation.participantName}</span>
        {conversation.unread > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {conversation.unread}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 pl-3.5 truncate">
        #{conversation.ticketId} · {conversation.lastMessage}
      </p>
    </button>
  )
}

interface ChatAreaProps {
  conversation: Conversation
}

function ChatArea({ conversation }: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <ChatHeader conversation={conversation} />
      <MessageList messages={conversation.messages} />
      <ChatInput />
    </div>
  )
}

function ChatHeader({ conversation }: { conversation: Conversation }) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
        {conversation.participantInitials}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{conversation.participantName}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className={clsx('w-1.5 h-1.5 rounded-full', conversation.isOnline ? 'bg-green-500' : 'bg-gray-300')} />
          {conversation.isOnline ? 'Online' : 'Offline'} · #{conversation.ticketId} – {conversation.ticketTitle}
        </p>
      </div>
    </div>
  )
}

function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={clsx('flex gap-2 max-w-[76%]', message.isMine && 'ml-auto flex-row-reverse')}>
      <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0 mt-0.5">
        {message.senderName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
      <div>
        <div
          className={clsx(
            'px-3.5 py-2.5 rounded-xl text-sm leading-relaxed',
            message.isMine
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm',
          )}
        >
          {message.content}
        </div>
        <p className={clsx('text-[10px] text-gray-400 mt-1', message.isMine && 'text-right')}>
          {message.sentAt}
        </p>
      </div>
    </div>
  )
}

function ChatInput() {
  return (
    <div className="px-5 py-3.5 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
      <button className="btn-icon flex-shrink-0" aria-label="Anexar arquivo">
        <Paperclip size={14} />
      </button>
      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-400">
        Digite uma mensagem...
      </div>
      <button className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors" aria-label="Enviar mensagem">
        <Send size={15} className="text-white" />
      </button>
    </div>
  )
}
