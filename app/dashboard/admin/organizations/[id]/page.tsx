import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, CARE_LEVELS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Users, Heart, FileText, CreditCard,
  UserCog, Package, TrendingUp, MapPin, Phone,
} from 'lucide-react'

export default async function OrgDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect('/login')

  const { id } = await params
  const currentMonth = new Date().toISOString().slice(0, 7)

  const org = await prisma.organization.findUnique({ where: { id } })
  if (!org) notFound()

  // 该机构的完整运营数据下钻
  const [
    elderCount, activeElders, careCount, staffCount, supplierCount, customerCount,
    paidAgg, unpaidAgg, monthPaidAgg, recentCare, elders, recentBills,
  ] = await Promise.all([
    prisma.elder.count({ where: { organizationId: id } }),
    prisma.elder.findMany({ where: { organizationId: id, status: 'ACTIVE' }, select: { careLevel: true } }),
    prisma.careRecord.count({ where: { organizationId: id } }),
    prisma.staffMember.count({ where: { organizationId: id } }),
    prisma.supplier.count({ where: { organizationId: id } }),
    prisma.customer.count({ where: { organizationId: id } }),
    prisma.billingRecord.aggregate({ where: { organizationId: id, status: 'PAID' }, _sum: { total: true } }),
    prisma.billingRecord.aggregate({ where: { organizationId: id, status: 'UNPAID' }, _sum: { total: true } }),
    prisma.billingRecord.aggregate({ where: { organizationId: id, status: 'PAID', month: currentMonth }, _sum: { total: true } }),
    prisma.careRecord.findMany({
      where: { organizationId: id },
      include: { elder: { select: { name: true } }, nurse: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }, take: 5,
    }),
    prisma.elder.findMany({ where: { organizationId: id }, orderBy: { admissionDate: 'desc' }, take: 8 }),
    prisma.billingRecord.findMany({
      where: { organizationId: id },
      include: { elder: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }, take: 5,
    }),
  ])

  const careLevelCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
  for (const e of activeElders) if (e.careLevel in careLevelCounts) careLevelCounts[e.careLevel]++

  const planLabels: Record<string, string> = { BASIC: '基础版', PROFESSIONAL: '专业版', PRO: '专业版', ENTERPRISE: '企业版' }

  const stats = [
    { label: '在院老人', value: activeElders.length, sub: `累计 ${elderCount} 人`, icon: Heart, color: 'text-rose-600 bg-rose-50' },
    { label: '护理记录', value: careCount, sub: '全部记录', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: '在职员工', value: staffCount, sub: '员工档案', icon: UserCog, color: 'text-purple-600 bg-purple-50' },
    { label: '意向客户', value: customerCount, sub: 'CRM 线索', icon: Users, color: 'text-teal-600 bg-teal-50' },
    { label: '供应商', value: supplierCount, sub: '合作供应商', icon: Package, color: 'text-orange-600 bg-orange-50' },
    { label: '本月已收', value: formatCurrency(monthPaidAgg._sum.total ?? 0), sub: `累计 ${formatCurrency(paidAgg._sum.total ?? 0)}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div className="space-y-6">
      {/* 返回 + 机构头 */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin/organizations" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl bg-[#2E75B6]/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-[#2E75B6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
              <Badge variant="info">{planLabels[org.plan] ?? org.plan}</Badge>
              <Badge variant={org.status === 'ACTIVE' ? 'success' : 'warning'}>
                {org.status === 'ACTIVE' ? '运营中' : '已暂停'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <span className="font-mono">{org.code}</span>
              {org.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{org.address}</span>}
              {org.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{org.phone}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 运营统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 财务概览 */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">财务概览</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-700">累计已收款</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(paidAgg._sum.total ?? 0)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs text-amber-700">待收账款</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(unpaidAgg._sum.total ?? 0)}</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-blue-700">本月已收</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(monthPaidAgg._sum.total ?? 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 护理等级分布 */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">护理等级分布</CardTitle></CardHeader>
          <CardContent>
            {activeElders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">暂无在院老人</p>
            ) : (
              <div className="space-y-3">
                {(['A', 'B', 'C'] as const).map((lvl) => {
                  const count = careLevelCounts[lvl]
                  const pct = activeElders.length > 0 ? Math.round((count / activeElders.length) * 100) : 0
                  const color = lvl === 'A' ? 'bg-emerald-500' : lvl === 'B' ? 'bg-yellow-500' : 'bg-red-500'
                  return (
                    <div key={lvl}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{lvl}级 · {CARE_LEVELS[lvl as CareLevelKey]?.label}</span>
                        <span className="text-gray-500">{count}人 · {pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 最近护理记录 */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">最近护理记录</CardTitle></CardHeader>
          <CardContent>
            {recentCare.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">暂无护理记录</p>
            ) : (
              <div className="space-y-2.5">
                {recentCare.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-[#2E75B6] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {r.elder.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-800">{r.elder.name}</span>
                      <span className="text-gray-400 text-xs ml-2">{r.type}</span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 在院老人 */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">在院老人</CardTitle></CardHeader>
          <CardContent>
            {elders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">暂无老人</p>
            ) : (
              <div className="space-y-2">
                {elders.map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{e.name}</span>
                      <span className="text-xs text-gray-400">{e.gender} · {e.age}岁</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={e.careLevel === 'A' ? 'success' : e.careLevel === 'B' ? 'warning' : 'danger'}>
                        {e.careLevel}级
                      </Badge>
                      <span className="text-xs text-gray-400">{e.roomNumber || '—'}室</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 最近账单 */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">最近账单</CardTitle></CardHeader>
          <CardContent>
            {recentBills.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">暂无账单</p>
            ) : (
              <div className="space-y-2">
                {recentBills.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <div>
                      <span className="font-medium text-gray-800">{b.elder.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{b.month}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">{formatCurrency(b.total)}</span>
                      <Badge variant={b.status === 'PAID' ? 'success' : 'danger'}>
                        {b.status === 'PAID' ? '已缴' : '待缴'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
