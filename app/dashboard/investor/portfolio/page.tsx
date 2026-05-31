import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, INVESTMENT_PRODUCTS } from '@/lib/utils'
import {
  TrendingUp,
  Calendar,
  Building2,
  Layers,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react'

const RATE_TIERS = [
  { label: '稳健型', minAmount: 100000, maxAmount: 199999, annualRate: 0.08, monthlyRate: 0.08 / 12 },
  { label: '成长型', minAmount: 200000, maxAmount: 499999, annualRate: 0.12, monthlyRate: 0.12 / 12 },
  { label: '进取型', minAmount: 500000, maxAmount: Infinity, annualRate: 0.16, monthlyRate: 0.16 / 12 },
]

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const investment = await prisma.investment.findFirst({
    where: { investorId: userId },
    include: {
      organization: true,
      returns: { orderBy: { month: 'desc' }, take: 6 },
    },
  })

  const productType = investment?.productType as keyof typeof INVESTMENT_PRODUCTS | undefined
  const product = productType ? INVESTMENT_PRODUCTS[productType] : null

  const monthsActive = investment
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(investment.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        )
      )
    : 0

  // 收益预测（3档：1年/3年/5年）
  const projections = investment && product
    ? [
        { years: 1, total: investment.amount + investment.amount * product.annualRate },
        { years: 3, total: investment.amount * Math.pow(1 + product.annualRate, 3) },
        { years: 5, total: investment.amount * Math.pow(1 + product.annualRate, 5) },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">我的投资</h1>
        <p className="text-sm text-gray-500 mt-1">查看投资详情、收益阶梯与预测分析</p>
      </div>

      {!investment ? (
        <Card>
          <CardContent className="py-16 text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">暂无投资记录，请联系客户经理了解投资方案</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 投资详情卡 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                投资详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: '投资机构', value: investment.organization.name, icon: Building2 },
                  { label: '投资总额', value: formatCurrency(investment.amount), icon: DollarSign },
                  { label: '产品类型', value: product ? `${product.label}（${investment.productType}型）` : investment.productType, icon: Layers },
                  { label: '持股比例', value: `${investment.sharePercent}%`, icon: TrendingUp },
                  { label: '月度收益', value: formatCurrency(investment.monthlyReturn), icon: ArrowUpRight },
                  { label: '入股日期', value: formatDate(investment.startDate), icon: Calendar },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">合同状态：</span>
                <Badge variant={investment.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {investment.status === 'ACTIVE' ? '执行中' : investment.status}
                </Badge>
                <span className="text-sm text-gray-500 ml-2">已运营 {monthsActive} 个月</span>
              </div>
            </CardContent>
          </Card>

          {/* 收益阶梯表 */}
          <Card>
            <CardHeader>
              <CardTitle>收益阶梯方案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left font-medium text-gray-500">产品类型</th>
                      <th className="pb-3 text-left font-medium text-gray-500">起投金额</th>
                      <th className="pb-3 text-left font-medium text-gray-500">年化收益率</th>
                      <th className="pb-3 text-left font-medium text-gray-500">月度收益率</th>
                      <th className="pb-3 text-left font-medium text-gray-500">当前适用</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {RATE_TIERS.map((tier) => {
                      const isCurrent =
                        investment.amount >= tier.minAmount &&
                        investment.amount <= tier.maxAmount
                      return (
                        <tr
                          key={tier.label}
                          className={isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        >
                          <td className="py-3 font-medium text-gray-900">{tier.label}</td>
                          <td className="py-3 text-gray-600">
                            {formatCurrency(tier.minAmount)}
                            {tier.maxAmount !== Infinity && ` ~ ${formatCurrency(tier.maxAmount)}`}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-emerald-600">
                              {(tier.annualRate * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">
                            {(tier.monthlyRate * 100).toFixed(2)}%
                          </td>
                          <td className="py-3">
                            {isCurrent && (
                              <Badge variant="success">当前档位</Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 收益预测 */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  当前投资收益预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {projections.map((proj) => (
                    <div
                      key={proj.years}
                      className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 text-center"
                    >
                      <p className="text-sm font-medium text-gray-600">{proj.years} 年后预计总资产</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-2">
                        {formatCurrency(proj.total)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        收益 {formatCurrency(proj.total - investment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                  * 以上预测基于当前年化收益率 {(product.annualRate * 100).toFixed(0)}% 复利计算，仅供参考，实际收益以合同约定为准。
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
