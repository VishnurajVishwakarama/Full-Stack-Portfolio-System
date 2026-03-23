'use client'
import { useState, useEffect } from 'react'
import { messagesService } from '@/lib/services'
import type { ContactMessage } from '@/types'
import { Badge } from '@/components/ui'
import toast from 'react-hot-toast'
import { Trash2, CheckCircle2 } from 'lucide-react'

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([])

  useEffect(() => {
    messagesService.getAll().then(setMessages)
  }, [])

  const handleMarkRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return
    try {
      await messagesService.markRead(id)
    } catch (err: any) {
      toast.error('Failed to mark as read')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete message?')) return
    try {
      await messagesService.delete(id)
      toast.success('Message deleted')
    } catch (err: any) {
      toast.error('Failed to delete')
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'Unknown'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleString()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white font-mono tracking-widest mb-6">INBOX</h1>
      <div className="flex flex-col gap-4">
        {messages.map(msg => (
          <div key={msg.id} className={`bg-ink-900 border ${msg.read ? 'border-white/10 opacity-75' : 'border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]'} rounded-xl p-6 transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                <p className="font-mono text-xs text-[#00f0ff]">{msg.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-500">{formatDate(msg.createdAt)}</span>
                {!msg.read && <Badge variant="cyan">NEW</Badge>}
              </div>
            </div>
            {msg.subject && <p className="font-bold text-ink-200 text-sm mb-2">Subject: {msg.subject}</p>}
            <div className="bg-ink-950/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-ink-300 whitespace-pre-wrap">{msg.message}</p>
            </div>
            <div className="flex gap-2 justify-end">
              {!msg.read && (
                <button onClick={() => handleMarkRead(msg.id!, !!msg.read)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-[#7fff6e]/10 text-[#7fff6e] rounded-md hover:bg-[#7fff6e]/20 transition-colors">
                  <CheckCircle2 size={14} /> Mark Read
                </button>
              )}
              <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-white/5 text-ink-200 rounded-md hover:bg-white/10 transition-colors">
                Reply Email
              </a>
              <button onClick={() => handleDelete(msg.id!)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-[#ff4d6d]/10 text-[#ff4d6d] rounded-md hover:bg-[#ff4d6d]/20 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-ink-500 font-mono border border-dashed border-white/10 rounded-xl">
            No messages in your inbox.
          </div>
        )}
      </div>
    </div>
  )
}
