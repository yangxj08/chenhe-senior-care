'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bell, Search, ChevronDown, LogOut, User, Settings, Heart, CreditCard, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLES } from '@/lib/utils'
import type { RoleKey } from '@/lib/utils'

// 通知类型
interface Notification {
  id: string
  type: 'care' | 'billing' | 'alert' | 'system'
  title: string
  body: string
  time: string
  read: boolean
}

// 按角色生成不同的通知内容
function getNotifications(role: string): Notification[] {
  if (role === 'NURSE') {
    return [
      { id: '1', type: 'care', title: '护理任务提醒', body: '李奶奶 08:00 晨间护理待完成', time: '10分钟前', read: false },
      { id: '2', type: 'alert', title: '异常体征提醒', body: '陈爷爷血压偏高 155/95，请关注', time: '1小时前', read: false },
      { id: '3', type: 'care', title: '用药提醒', body: '王爷爷 12:00 午间用药时间到', time: '2小时前', read: true },
    ]
  }
  if (role === 'FAMILY') {
    return [
      { id: '1', type: 'care', title: '今日护理完成', body: '李奶奶今日护理记录已更新，状态良好', time: '30分钟前', read: false },
      { id: '2', type: 'billing', title: '账单待缴提醒', body: '2026年5月账单 ¥4,700 待缴纳', time: '1天前', read: false },
      { id: '3', type: 'system', title: '机构公告', body: '本周六举办端午节活动，欢迎家属参加', time: '2天前', read: true },
    ]
  }
  if (role === 'INVESTOR') {
    return [
      { id: '1', type: 'billing', title: '本月分红到账', body: '2026年5月分红 ¥8,780 已到账', time: '1天前', read: false },
      { id: '2', type: 'system', title: '经营月报发布', body: '5月份财务报告已发布，入住率85%', time: '3天前', read: false },
      { id: '3', type: 'system', title: '投资人季报', body: '2026年Q2季报已更新，请查阅', time: '1周前', read: true },
    ]
  }
  // ORG_ADMIN / SUPER_ADMIN
  return [
    { id: '1', type: 'alert', title: '异常体征上报', body: '陈爷爷血压偏高，护理员已记录', time: '10分钟前', read: false },
    { id: '2', type: 'billing', title: '账单待处理', body: '本月有 2 笔账单待收款，合计 ¥12,400', time: '1小时前', read: false },
    { id: '3', type: 'care', title: '新增护理记录', body: '张护士刚提交陈爷爷护理记录', time: '2小时前', read: true },
    { id: '4', type: 'system', title: '系统通知', body: '新加盟商「宁远颐养院」申请审核', time: '1天前', read: true },
  ]
}

const typeIcon: Record<string, React.ReactNode> = {
  care:    <Heart className="h-4 w-4 text-rose-500" />,
  billing: <CreditCard className="h-4 w-4 text-amber-500" />,
  alert:   <AlertTriangle className="h-4 w-4 text-red-500" />,
  system:  <CheckCircle2 className="h-4 w-4 text-blue-500" />,
}

const typeBg: Record<string, string> = {
  care:    'bg-rose-50',
  billing: 'bg-amber-50',
  alert:   'bg-red-50',
  system:  'bg-blue-50',
}

export default function Header() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  const userRole = (session?.user as any)?.role as RoleKey
  const roleLabel = userRole ? ROLES[userRole]?.label : ''
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getNotifications(userRole || 'ORG_ADMIN')
  )

  // 角色变化时重新生成通知
  useEffect(() => {
    if (userRole) setNotifications(getNotifications(userRole))
  }, [userRole])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // 点外部关闭通知面板
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    if (bellOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [bellOpen])

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 z-30 relative">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="搜索老人、记录、账单..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* ── Notification Bell ───────────────────────── */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setBellOpen(!bellOpen); setDropdownOpen(false) }}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
              bellOpen
                ? 'border-blue-300 bg-blue-50 text-blue-600'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">通知</span>
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    全部已读
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Bell className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">暂无通知</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        'group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors',
                        n.read ? 'hover:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50'
                      )}
                    >
                      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', typeBg[n.type])}>
                        {typeIcon[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={cn('text-sm font-medium truncate', n.read ? 'text-gray-700' : 'text-gray-900')}>
                            {n.title}
                          </p>
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissNotification(n.id) }}
                        className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 transition-all"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <button
                    onClick={() => setNotifications([])}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    清空全部通知
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── User Dropdown ────────────────────────────── */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setBellOpen(false) }}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-gray-900 leading-none">{session?.user?.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{roleLabel}</div>
            </div>
            <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="text-xs font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
