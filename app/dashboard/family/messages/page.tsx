'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Send, MessageSquare, User } from 'lucide-react'

interface Message {
  id: string
  content: string
  fromMe: boolean
  time: string
  senderName: string
}

interface Contact {
  id: string
  name: string
  role: string
  lastMessage: string
  avatar: string
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'org-admin',
    name: '李院长',
    role: '机构管理员',
    lastMessage: '您好，刘奶奶本月账单已生成，请及时查看并缴纳',
    avatar: '李',
  },
  {
    id: 'nurse',
    name: '张护士',
    role: '护理人员',
    lastMessage: '刘奶奶今日状态良好，请放心',
    avatar: '张',
  },
]

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'org-admin': [
    {
      id: '1',
      content: '您好，刘奶奶本月账单已生成，请及时查看并缴纳',
      fromMe: false,
      time: '10:30',
      senderName: '李院长',
    },
  ],
  nurse: [
    {
      id: '1',
      content: '您好！刘奶奶今日早上状态很好，吃了两碗粥，心情也不错',
      fromMe: false,
      time: '08:15',
      senderName: '张护士',
    },
    {
      id: '2',
      content: '下午我们给她做了血压测量，结果偏高，已记录在档，请注意关注',
      fromMe: false,
      time: '14:22',
      senderName: '张护士',
    },
  ],
}

const AUTO_REPLIES: Record<string, string[]> = {
  'org-admin': [
    '好的，我已收到您的消息，稍后回复您。',
    '感谢您的关心，我们会及时处理您的问题。',
    '如有紧急情况请直接拨打机构电话：0735-7777777',
  ],
  nurse: [
    '好的，我注意到了，谢谢您的关心！',
    '奶奶状态很好，请放心，我会继续关注的。',
    '今日护理已完成，详情请查看护理记录页面。',
  ],
}

function formatNow() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

export default function MessagesPage() {
  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS)
  const [activeContactId, setActiveContactId] = useState<string>('org-admin')
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [replying, setReplying] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeContact = contacts.find((c) => c.id === activeContactId)
  const currentMessages = messages[activeContactId] ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeContactId])

  function sendMessage() {
    const content = input.trim()
    if (!content) return

    const newMsg: Message = {
      id: Date.now().toString(),
      content,
      fromMe: true,
      time: formatNow(),
      senderName: '我',
    }

    setMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] ?? []), newMsg],
    }))
    setInput('')
    setReplying(true)

    // 模拟自动回复
    const replies = AUTO_REPLIES[activeContactId] ?? ['收到，稍后回复您。']
    const reply = replies[Math.floor(Math.random() * replies.length)]

    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        fromMe: false,
        time: formatNow(),
        senderName: activeContact?.name ?? '对方',
      }
      setMessages((prev) => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] ?? []), replyMsg],
      }))
      setReplying(false)
    }, 1200)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">消息沟通</h1>
        <p className="text-sm text-gray-500 mt-1">与机构工作人员实时沟通</p>
      </div>

      <div className="flex h-[calc(100vh-220px)] min-h-[500px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* 左侧联系人列表 */}
        <div className="w-64 shrink-0 border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">联系人</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100',
                  activeContactId === contact.id && 'bg-blue-50 hover:bg-blue-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    activeContactId === contact.id ? 'bg-blue-500' : 'bg-gray-400'
                  )}
                >
                  {contact.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.role}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{contact.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧聊天区域 */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* 顶部联系人信息 */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
              {activeContact?.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{activeContact?.name}</p>
              <p className="text-xs text-gray-500">{activeContact?.role}</p>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {currentMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="h-10 w-10 mb-2" />
                <p className="text-sm">暂无消息，发送第一条消息开始沟通</p>
              </div>
            )}
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.fromMe ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* 头像 */}
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    msg.fromMe ? 'bg-emerald-500' : 'bg-blue-500'
                  )}
                >
                  {msg.fromMe ? '我' : (activeContact?.avatar ?? <User />)}
                </div>

                {/* 气泡 */}
                <div
                  className={cn(
                    'max-w-[65%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.fromMe
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  )}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      msg.fromMe ? 'text-blue-200 text-right' : 'text-gray-400'
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* 正在输入提示 */}
            {replying && (
              <div className="flex items-end gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {activeContact?.avatar}
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <div className="flex gap-1 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* 底部发送框 */}
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`发消息给 ${activeContact?.name}…`}
                className="flex-1"
                disabled={replying}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || replying}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">按 Enter 发送消息</p>
          </div>
        </div>
      </div>
    </div>
  )
}
