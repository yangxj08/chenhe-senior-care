import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Building2,
  Users,
  CreditCard,
  UserCheck,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  const [orgCount, elderCount, paidRevenueAgg, unpaidAgg, userCount, recentOrgs] = await Promise.all([
    prisma.organization.count(),
    prisma.elder.count({ where: { status: 'ACTIVE' } }),
    prisma.billingRecord.aggregate({ _sum: { total: true }, where: { status: 'PAID' } }),
    prisma.billingRecord.aggregate({ _sum: { total: true }, where: { status: 'UNPAID' } }),
    prisma.user.count(),
    prisma.organization.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
  ])

  const totalRevenue = paidRevenueAgg._sum.total ?? 0
  const totalUnpaid = unpaidAgg._sum.total ?? 0

  const stats = [
    {
      title: '合作机构数',
      value: orgCount,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: '全平台已注册',
    },
    {
      title: '在院老人',
      value: elderCount,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: '全平台在住',
    },
    {
      title: '累计已收款',
      value: formatCurrency(totalRevenue),
      icon: CreditCard,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: `待收 ${formatCurrency(totalUnpaid)}`,
    },
    {
      title: '系统用户',
      value: userCount,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: '全部注册账号',
    },
  ]

  const planLabels: Record<string, string> = {
    BASIC: '基础版',
    PRO: '专业版',
    ENTERPRISE: '企业版',
  }

  const statusVariant = (status: string): 'success' | 'danger' | 'warning' | 'secondary' => {
    if (status === 'ACTIVE') return 'success'
    if (status === 'INACTIVE') return 'danger'
    if (status === 'SUSPENDED') return 'warning'
    return 'secondary'
  }

  const statusLabel = (status: string): string => {
    if (status === 'ACTIVE') return '正常'
    if (status === 'INACTIVE') return '停用'
    if (status === 'SUSPENDED') return '暂停'
    return status
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">总部数据大屏</h1>
        <p className="text-sm text-gray-500 mt-1">
          欢迎回来，{session?.user?.name}。以下是平台全局概览。
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>最近注册机构</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrgs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">暂无机构数据</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">机构名称</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">编码</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">地址</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">套餐</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrgs.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{org.name}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">{org.code}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                        {org.address || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          {planLabels[org.plan] ?? org.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(org.status)}>
                          {statusLabel(org.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {formatDate(org.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
