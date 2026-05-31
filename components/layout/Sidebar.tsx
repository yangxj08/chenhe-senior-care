'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Heart, FileText, CreditCard,
  UserCog, TrendingUp, MessageSquare, Building2,
  ChevronLeft, ChevronRight, LogOut, Home, BarChart3,
  PieChart, Wallet, BookOpen, Bell, Shield,
} from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

// ── 每个角色独立的导航结构，href 对应实际存在的页面 ──────────────
const NAV_BY_ROLE: Record<string, { title: string; color: string; items: NavItem[] }> = {
  SUPER_ADMIN: {
    title: '总部管理',
    color: 'bg-indigo-900',
    items: [
      { href: '/dashboard/admin', icon: LayoutDashboard, label: '总部大屏' },
      { href: '/dashboard/admin/organizations', icon: Building2, label: '机构管理' },
      { href: '/dashboard/admin/users', icon: Users, label: '用户管理' },
      { href: '/dashboard/admin/analytics', icon: BarChart3, label: '数据分析' },
    ],
  },
  ORG_ADMIN: {
    title: '机构管理',
    color: 'bg-blue-900',
    items: [
      { href: '/dashboard/org', icon: LayoutDashboard, label: '机构首页' },
      { href: '/dashboard/org/elders', icon: Heart, label: '老人管理' },
      { href: '/dashboard/org/care', icon: FileText, label: '护理记录' },
      { href: '/dashboard/org/customers', icon: Users, label: '客户数据库' },
      { href: '/dashboard/org/staff', icon: UserCog, label: '员工管理' },
      { href: '/dashboard/org/supply', icon: Building2, label: '供应链' },
      { href: '/dashboard/org/billing', icon: CreditCard, label: '费用管理' },
      { href: '/dashboard/org/reports', icon: BarChart3, label: '报表统计' },
    ],
  },
  NURSE: {
    title: '护理工作台',
    color: 'bg-teal-900',
    items: [
      { href: '/dashboard/org', icon: LayoutDashboard, label: '工作台' },
      { href: '/dashboard/org/elders', icon: Heart, label: '老人列表' },
      { href: '/dashboard/org/care', icon: FileText, label: '护理记录' },
      { href: '/dashboard/org/care/new', icon: BookOpen, label: '新增记录' },
    ],
  },
  FAMILY: {
    title: '家属服务',
    color: 'bg-green-900',
    items: [
      { href: '/dashboard/family', icon: Home, label: '家属首页' },
      { href: '/dashboard/family/elder', icon: Heart, label: '老人状态' },
      { href: '/dashboard/family/billing', icon: CreditCard, label: '费用缴纳' },
      { href: '/dashboard/family/messages', icon: MessageSquare, label: '消息沟通' },
    ],
  },
  INVESTOR: {
    title: '投资人门户',
    color: 'bg-amber-900',
    items: [
      { href: '/dashboard/investor', icon: TrendingUp, label: '投资概览' },
      { href: '/dashboard/investor/portfolio', icon: PieChart, label: '我的投资' },
      { href: '/dashboard/investor/returns', icon: Wallet, label: '分红记录' },
      { href: '/dashboard/investor/reports', icon: BarChart3, label: '财务报告' },
    ],
  },
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '超级管理员',
  ORG_ADMIN: '机构管理员',
  NURSE: '护理员',
  FAMILY: '家属',
  INVESTOR: '投资人',
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role || 'ORG_ADMIN'
  const nav = NAV_BY_ROLE[role] || NAV_BY_ROLE.ORG_ADMIN

  return (
    <aside
      className={cn(
        'relative flex flex-col text-white transition-all duration-300 ease-in-out shrink-0',
        nav.color,
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-none truncate">郴和养老</div>
              <div className="text-xs text-white/50 mt-0.5 truncate">{nav.title}</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mx-auto">
            <Heart className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-colors',
            collapsed && 'absolute -right-3 top-5 bg-gray-800 border border-gray-700 shadow-md z-10'
          )}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && session?.user && (
        <div className="px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
              {session.user.name?.[0] || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{session.user.name}</p>
              <p className="text-[10px] text-white/50 truncate">{ROLE_LABELS[role]}</p>
            </div>
            {role === 'SUPER_ADMIN' && <Shield className="h-3 w-3 text-yellow-400 shrink-0" />}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {nav.items.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/dashboard/org' || item.href === '/dashboard/admin'
              || item.href === '/dashboard/family' || item.href === '/dashboard/investor'
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                    isActive
                      ? 'bg-white/20 text-white font-medium shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/10 p-2 space-y-0.5">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all',
            collapsed && 'justify-center'
          )}
          title={collapsed ? '返回官网' : undefined}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>返回官网</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className={cn(
            'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all',
            collapsed && 'justify-center'
          )}
          title={collapsed ? '退出登录' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </aside>
  )
}
