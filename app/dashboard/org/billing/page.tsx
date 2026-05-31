import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, BILLING_STATUS } from '@/lib/utils'
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (role === 'NURSE') {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard/org')
  }
  const orgId = (session?.user as any)?.organizationId

  const records = await prisma.billingRecord.findMany({
    where: { organizationId: orgId },
    include: { elder: true },
    orderBy: { createdAt: 'desc' },
  })

  // Compute stats
  const totalAmount = records.reduce((sum, r) => sum + r.total, 0)
  const paidAmount = records
    .filter((r) => r.status === 'PAID')
    .reduce((sum, r) => sum + r.total, 0)
  const unpaidAmount = records
    .filter((r) => r.status === 'UNPAID')
    .reduce((sum, r) => sum + r.total, 0)
  const overdueAmount = records
    .filter((r) => r.status === 'OVERDUE')
    .reduce((sum, r) => sum + r.total, 0)

  const stats = [
    {
      title: '本月总额',
      value: formatCurrency(totalAmount),
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      sub: `共 ${records.length} 条账单`,
    },
    {
      title: '已缴费用',
      value: formatCurrency(paidAmount),
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      sub: `${records.filter((r) => r.status === 'PAID').length} 条已缴`,
    },
    {
      title: '待缴费用',
      value: formatCurrency(unpaidAmount),
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      sub: `${records.filter((r) => r.status === 'UNPAID').length} 条待缴`,
    },
    {
      title: '逾期费用',
      value: formatCurrency(overdueAmount),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      sub: `${records.filter((r) => r.status === 'OVERDUE').length} 条逾期`,
    },
  ]

  const statusVariantMap: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
    PAID: 'success',
    UNPAID: 'danger',
    OVERDUE: 'warning',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">账单管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理机构内所有老人的费用账单</p>
        </div>
        <Button variant="default">
          <CreditCard className="h-4 w-4" />
          生成账单
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>账单列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CreditCard className="h-10 w-10 mb-3" />
              <p className="text-sm font-medium">暂无账单数据</p>
              <p className="text-xs mt-1">点击右上角"生成账单"创建本月账单</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      老人姓名
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      月份
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      基础费
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      护理费
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      药品费
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      合计
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {records.map((record) => {
                    const statusInfo = BILLING_STATUS[record.status as keyof typeof BILLING_STATUS]
                    const variant = statusVariantMap[record.status] ?? 'default'
                    return (
                      <tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex-shrink-0">
                              {record.elder.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {record.elder.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{record.month}</td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {formatCurrency(record.baseFee)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {formatCurrency(record.careFee)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {formatCurrency(record.medicineFee)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {formatCurrency(record.total)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={variant}>
                            {statusInfo?.label ?? record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              查看
                            </Button>
                            {record.status === 'UNPAID' && (
                              <Button variant="accent" size="sm">
                                收款
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
