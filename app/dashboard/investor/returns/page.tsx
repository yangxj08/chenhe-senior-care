import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Gift, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import ReturnChart from './ReturnChart'

export default async function ReturnsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const investment = await prisma.investment.findFirst({
    where: { investorId: userId },
    include: {
      returns: { orderBy: { month: 'desc' } },
      organization: true,
    },
  })

  const returns = investment?.returns ?? []

  // 年度汇总
  const yearSummary: Record<string, { total: number; count: number; paid: number }> = {}
  for (const r of returns) {
    const year = r.month.slice(0, 4)
    if (!yearSummary[year]) yearSummary[year] = { total: 0, count: 0, paid: 0 }
    yearSummary[year].total += r.amount
    yearSummary[year].count += 1
    if (r.status === 'PAID') yearSummary[year].paid += r.amount
  }

  const totalPaid = returns.filter((r) => r.status === 'PAID').reduce((s, r) => s + r.amount, 0)
  const totalPending = returns.filter((r) => r.status === 'PENDING').reduce((s, r) => s + r.amount, 0)

  // 图表数据（最近 12 条，倒序变正序）
  const chartData = [...returns]
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      month: r.month.slice(5),
      amount: r.amount,
      status: r.status,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分红记录</h1>
        <p className="text-sm text-gray-500 mt-1">查看历史分红发放详情与走势</p>
      </div>

      {/* 汇总指标 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">已发放合计</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">待发放合计</p>
              <p className="text-xl font-bold text-amber-700">{formatCurrency(totalPending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">累计分红总额</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(totalPaid + totalPending)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 走势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            分红走势图（近12个月）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReturnChart data={chartData} />
        </CardContent>
      </Card>

      {/* 年度汇总 */}
      {Object.keys(yearSummary).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>年度汇总</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(yearSummary)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, summary]) => (
                  <div
                    key={year}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                        <Gift className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{year} 年</p>
                        <p className="text-xs text-gray-500">共 {summary.count} 笔</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(summary.total)}</p>
                      <p className="text-xs text-emerald-600">已发 {formatCurrency(summary.paid)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分红明细表 */}
      <Card>
        <CardHeader>
          <CardTitle>分红明细</CardTitle>
        </CardHeader>
        <CardContent>
          {returns.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Gift className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">暂无分红记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left font-medium text-gray-500">月份</th>
                    <th className="pb-3 text-left font-medium text-gray-500">分红金额</th>
                    <th className="pb-3 text-left font-medium text-gray-500">状态</th>
                    <th className="pb-3 text-left font-medium text-gray-500">发放日期</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returns.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{r.month}</td>
                      <td className="py-3 text-gray-900">{formatCurrency(r.amount)}</td>
                      <td className="py-3">
                        <Badge variant={r.status === 'PAID' ? 'success' : 'warning'}>
                          {r.status === 'PAID' ? '已发放' : '待发放'}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500">
                        {r.paidAt
                          ? new Date(r.paidAt).toLocaleDateString('zh-CN')
                          : '—'}
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
