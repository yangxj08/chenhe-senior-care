import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, INVESTMENT_PRODUCTS } from '@/lib/utils'
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Gift,
  Shield,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'

export default async function InvestorOverviewPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const investment = await prisma.investment.findFirst({
    where: { investorId: userId },
    include: { organization: true, returns: { orderBy: { createdAt: 'desc' } } },
  })

  const productType = investment?.productType as keyof typeof INVESTMENT_PRODUCTS | undefined
  const product = productType ? INVESTMENT_PRODUCTS[productType] : null

  // 模拟计算累计收益
  const monthsActive = investment
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(investment.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        )
      )
    : 0
  const totalReturn = investment ? investment.monthlyReturn * monthsActive : 0

  // 本月分红（最近一条 PENDING 或 PAID）
  const latestReturn = investment?.returns?.[0]
  const thisMonthDividend = latestReturn ? latestReturn.amount : 0

  const guarantees = [
    { icon: '🏠', title: '资产抵押担保', desc: '以机构固定资产作为抵押，保障本金安全' },
    { icon: '🏦', title: '监管账户托管', desc: '资金存入第三方银行监管账户，专款专用' },
    { icon: '📋', title: '信息透明披露', desc: '每季度发布详细财务报告，全程透明' },
    { icon: '🔄', title: '回购退出条款', desc: '满足条件可按协议价格回购，保障流动性' },
    { icon: '🛡️', title: '商业责任保险', desc: '购买机构责任险，分散运营风险' },
    { icon: '✅', title: '政府备案背书', desc: '在民政部门完成备案，受行政监督' },
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm">欢迎回来</p>
            <h1 className="text-2xl font-bold mt-1">{session.user?.name}</h1>
            {investment ? (
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {investment.organization.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {product ? `${product.label}（年化 ${(product.annualRate * 100).toFixed(0)}%）` : investment.productType}
                </span>
                <Badge variant="success" className="text-xs">
                  {investment.status === 'ACTIVE' ? '合同生效中' : investment.status}
                </Badge>
              </div>
            ) : (
              <p className="mt-2 text-blue-200 text-sm">暂无投资记录，请联系客户经理</p>
            )}
          </div>
          <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <PieChart className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* 4 个指标卡 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: '投资总额',
            value: investment ? formatCurrency(investment.amount) : '—',
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            sub: '已出资金额',
          },
          {
            title: '持股比例',
            value: investment ? `${investment.sharePercent}%` : '—',
            icon: PieChart,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            sub: '占机构股权',
          },
          {
            title: '累计收益',
            value: investment ? formatCurrency(totalReturn) : '—',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            sub: `已运营 ${monthsActive} 个月（模拟）`,
          },
          {
            title: '本月分红',
            value: investment ? formatCurrency(thisMonthDividend) : '—',
            icon: Gift,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            sub:
              latestReturn?.status === 'PAID'
                ? '已发放'
                : latestReturn?.status === 'PENDING'
                ? '处理中'
                : '暂无记录',
          },
        ].map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 机构实时运营 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              机构实时运营
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {investment ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">入住率</span>
                    <span className="font-semibold text-gray-900">85%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: '85%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">目标入住率 90%，当前 85%</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">本月营收</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(328000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">较上月增长</span>
                    <span className="font-semibold text-emerald-600">+3.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">在院老人</span>
                    <span className="font-semibold text-gray-900">34 位</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">护理人员</span>
                    <span className="font-semibold text-gray-900">12 名</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">近6个月收入趋势</p>
                  <div className="flex items-end gap-1.5 h-16">
                    {[72, 78, 81, 85, 90, 96].map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-blue-400 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${(v / 100) * 100}%` }}
                        title={`${v}%`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>12月</span>
                    <span>1月</span>
                    <span>2月</span>
                    <span>3月</span>
                    <span>4月</span>
                    <span>5月</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">暂无投资数据</p>
            )}
          </CardContent>
        </Card>

        {/* 6重资金保障 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              六重资金保障体系
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guarantees.map((g, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg">
                    {g.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-gray-900">{g.title}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
