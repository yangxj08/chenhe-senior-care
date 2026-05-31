import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, CARE_LEVELS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import { Users, Heart, CreditCard, TrendingUp, AlertCircle, Plus, ClipboardList } from 'lucide-react'
import Link from 'next/link'

export default async function OrgDashboardPage() {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as any)?.organizationId as string | undefined
  const role = (session?.user as any)?.role as string
  const isAdmin = role === 'ORG_ADMIN' || role === 'SUPER_ADMIN'
  const userId = (session?.user as any)?.id as string

  if (!organizationId) redirect('/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 所有角色都需要的查询
  const [activeElderCount, todayCareCount, recentCareRecords, allElders] = await Promise.all([
    prisma.elder.count({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.careRecord.count({ where: { organizationId, createdAt: { gte: today } } }),
    prisma.careRecord.findMany({
      where: {
        organizationId,
        // 护理员只看自己的记录
        ...(isAdmin ? {} : { nurseId: userId }),
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        elder: { select: { name: true } },
        nurse: { select: { name: true } },
      },
    }),
    prisma.elder.findMany({
      where: { organizationId, status: 'ACTIVE' },
      select: { careLevel: true },
    }),
  ])

  const currentMonth = today.toISOString().slice(0, 7) // "2026-05"

  // 财务数据只查管理员
  const [unpaidBillingCount, monthRevenue, allTimePaidRevenue] = isAdmin
    ? await Promise.all([
        prisma.billingRecord.count({ where: { organizationId, status: 'UNPAID' } }),
        prisma.billingRecord
          .aggregate({ where: { organizationId, month: currentMonth, status: 'PAID' }, _sum: { total: true } })
          .then((r) => r._sum.total ?? 0),
        prisma.billingRecord
          .aggregate({ where: { organizationId, status: 'PAID' }, _sum: { total: true } })
          .then((r) => r._sum.total ?? 0),
      ])
    : [0, 0, 0]

  // 护理员：今日本人完成的护理次数
  const myTodayCareCount = isAdmin
    ? null
    : await prisma.careRecord.count({
        where: { organizationId, nurseId: userId, createdAt: { gte: today } },
      })

  // 护理等级分布
  const careLevelCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const elder of allElders) {
    const level = elder.careLevel as string
    if (level in careLevelCounts) careLevelCounts[level] = (careLevelCounts[level] ?? 0) + 1
  }

  const careLevelEntries = Object.entries(CARE_LEVELS) as [CareLevelKey, (typeof CARE_LEVELS)[CareLevelKey]][]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? '机构仪表盘' : '护理工作台'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            欢迎回来，{session?.user?.name}
            {isAdmin ? '。以下是本机构实时数据。' : '。以下是您今日的护理工作概览。'}
          </p>
        </div>
        {!isAdmin && (
          <Link
            href="/dashboard/org/care/new"
            className="inline-flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700 h-10 px-4 text-sm rounded-xl font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增护理记录
          </Link>
        )}
      </div>

      {/* ── 管理员统计卡 ─────────────────────────────── */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: '在住老人数', value: activeElderCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', desc: '当前在院', href: '/dashboard/org/elders' },
            { title: '今日护理次数', value: todayCareCount, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', desc: '今日全部完成', href: '/dashboard/org/care' },
            { title: '待缴账单', value: unpaidBillingCount, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', desc: '待处理账单', href: '/dashboard/org/billing' },
            { title: '本月已收款', value: formatCurrency(monthRevenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: `累计已收 ${formatCurrency(allTimePaidRevenue)}`, href: '/dashboard/org/reports' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── 护理员统计卡（不含财务） ─────────────────── */}
      {!isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: '在院老人总数', value: activeElderCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', desc: '全机构在院' },
            { title: '今日全院护理', value: todayCareCount, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', desc: '今日全部记录' },
            { title: '我的今日护理', value: myTodayCareCount ?? 0, icon: ClipboardList, color: 'text-teal-600', bg: 'bg-teal-50', desc: '我已完成' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 护理记录 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">
              {isAdmin ? '最近护理记录' : '我的最近护理记录'}
            </CardTitle>
            <Link href="/dashboard/org/care/new" className="text-xs text-teal-600 hover:underline flex items-center gap-1">
              <Plus className="h-3 w-3" />新增
            </Link>
          </CardHeader>
          <CardContent>
            {recentCareRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">暂无护理记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCareRecords.map((record) => (
                  <div key={record.id} className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{record.elder.name}</p>
                      <Badge variant="info">{record.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{record.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      护理人：{record.nurse.name} · {formatDate(record.createdAt)}
                    </p>
                  </div>
                ))}
                <Link href="/dashboard/org/care" className="block text-center text-xs text-[#2E75B6] hover:underline pt-1">
                  查看全部记录 →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 护理等级分布 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">护理等级分布</CardTitle>
          </CardHeader>
          <CardContent>
            {activeElderCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">暂无在院老人</p>
              </div>
            ) : (
              <div className="space-y-4">
                {careLevelEntries
                  .filter(([key]) => (careLevelCounts[key] ?? 0) > 0 || ['A', 'B', 'C'].includes(key))
                  .map(([key, info]) => {
                    const count = careLevelCounts[key] ?? 0
                    const pct = activeElderCount > 0 ? Math.round((count / activeElderCount) * 100) : 0
                    const barColor = key === 'A' ? 'bg-emerald-500' : key === 'B' ? 'bg-yellow-500' : key === 'C' ? 'bg-red-500' : 'bg-purple-500'
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{key}级 · {info.label}</span>
                          <span className="text-sm text-gray-500">{count}人 · {pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
