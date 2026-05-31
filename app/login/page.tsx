'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Building2, UserCog, Users, TrendingUp, Eye, EyeOff } from 'lucide-react'

const ROLES = [
  {
    key: 'org',
    label: '机构管理',
    icon: Building2,
    color: 'bg-blue-500',
    border: 'border-blue-400',
    demo: { email: 'orgadmin@jiahee.com', password: 'admin123', hint: '机构管理员账号' },
  },
  {
    key: 'nurse',
    label: '护理人员',
    icon: Heart,
    color: 'bg-teal-500',
    border: 'border-teal-400',
    demo: { email: 'nurse@jiahee.com', password: 'admin123', hint: '护理员账号' },
  },
  {
    key: 'family',
    label: '家  属',
    icon: Users,
    color: 'bg-green-500',
    border: 'border-green-400',
    demo: { email: 'family@example.com', password: 'admin123', hint: '家属账号' },
  },
  {
    key: 'investor',
    label: '投资人',
    icon: TrendingUp,
    color: 'bg-amber-500',
    border: 'border-amber-400',
    demo: { email: 'investor@example.com', password: 'admin123', hint: '投资人账号' },
  },
  {
    key: 'admin',
    label: '超级管理',
    icon: UserCog,
    color: 'bg-indigo-500',
    border: 'border-indigo-400',
    demo: { email: 'admin@chenhe.com', password: 'admin123', hint: '总部超管账号' },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState(ROLES[0])
  const [email, setEmail] = useState(ROLES[0].demo.email)
  const [password, setPassword] = useState(ROLES[0].demo.password)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function selectRole(role: typeof ROLES[0]) {
    setSelectedRole(role)
    setEmail(role.demo.email)
    setPassword(role.demo.password)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('邮箱或密码错误，请重试')
    } else {
      router.push('/dashboard')
    }
  }

  const Icon = selectedRole.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white text-2xl font-bold">郴和养老</div>
              <div className="text-blue-300 text-xs">SaaS 管理平台</div>
            </div>
          </div>
          <p className="text-blue-200/70 text-sm">住得安心，活得舒心，老得放心</p>
        </div>

        {/* Role selector */}
        <div className="mb-4">
          <p className="text-white/50 text-xs text-center mb-3 uppercase tracking-wider">选择您的登录身份</p>
          <div className="grid grid-cols-5 gap-2">
            {ROLES.map((role) => {
              const RIcon = role.icon
              const active = selectedRole.key === role.key
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => selectRole(role)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all text-xs font-medium ${
                    active
                      ? `${role.color} border-transparent text-white shadow-lg scale-105`
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <RIcon className="w-4 h-4" />
                  <span className="leading-tight text-center">{role.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
          {/* Current role indicator */}
          <div className={`flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/5 border ${selectedRole.border}/30`}>
            <div className={`w-9 h-9 rounded-xl ${selectedRole.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">以「{selectedRole.label.trim()}」身份登录</p>
              <p className="text-white/40 text-xs">{selectedRole.demo.hint} · 演示账号已自动填入</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5">邮箱账号</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 pr-11 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 shadow-lg ${selectedRole.color} hover:opacity-90 active:scale-95`}
            >
              {loading ? '登录中...' : `进入${selectedRole.label.trim()}后台 →`}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          想加盟合作？
          <Link href="/franchise" className="text-blue-300 hover:text-white ml-1 transition-colors">
            申请加盟 →
          </Link>
        </p>
      </div>
    </div>
  )
}
