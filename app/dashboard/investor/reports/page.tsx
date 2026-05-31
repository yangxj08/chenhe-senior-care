import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { FileText, BarChart3, TrendingUp, Users, ChevronDown } from 'lucide-react'

// 模拟季度报告数据（实际应从数据库或文件系统读取）
const QUARTERLY_REPORTS = [
  {
    quarter: '2025 Q1',
    period: '2025年1月—3月',
    publishDate: '2025-04-15',
    revenue: 984000,
    expenses: 621000,
    netProfit: 363000,
    occupancyRate: 87,
    elderCount: 35,
    staffCount: 12,
    highlights: [
      '新增入住老人 3 位，入住率同比提升 4%',
      '完成护理人员专项培训 2 期',
      '引进新型护理设备 5 台套',
    ],
  },
  {
    quarter: '2024 Q4',
    period: '2024年10月—12月',
    publishDate: '2025-01-20',
    revenue: 936000,
    expenses: 598000,
    netProfit: 338000,
    occupancyRate: 83,
    elderCount: 33,
    staffCount: 11,
    highlights: [
      '完成年度财务审计，各项指标合规',
      '投资人年度回报率达 12.4%',
      '扩建护理单元一期完工',
    ],
  },
  {
    quarter: '2024 Q3',
    period: '2024年7月—9月',
    publishDate: '2024-10-18',
    revenue: 895000,
    expenses: 572000,
    netProfit: 323000,
    occupancyRate: 80,
    elderCount: 31,
    staffCount: 11,
    highlights: [
      '通过省级养老机构等级评定',
      '开展"健康夏日"老人活动 6 场',
      '新增合作医院绿色通道 2 家',
    ],
  },
  {
    quarter: '2024 Q2',
    period: '2024年4月—6月',
    publishDate: '2024-07-22',
    revenue: 852000,
    expenses: 551000,
    netProfit: 301000,
    occupancyRate: 77,
    elderCount: 29,
    staffCount: 10,
    highlights: [
      '机构正式投入运营，首批入住 26 位',
      '完成全体员工岗前培训',
      '签署第一批投资人合同',
    ],
  },
]

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const investment = await prisma.investment.findFirst({
    where: { investorId: userId },
    include: { organization: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">财务报告</h1>
        <p className="text-sm text-gray-500 mt-1">
          {investment?.organization.name ?? '—'} · 季度运营与财务报告
        </p>
      </div>

      {/* 运营数据概览 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: '机构名称', value: investment?.organization.name ?? '—', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '最新入住率', value: `${QUARTERLY_REPORTS[0].occupancyRate}%`, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: '最近季度营收', value: formatCurrency(QUARTERLY_REPORTS[0].revenue), icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '最近季度利润', value: formatCurrency(QUARTERLY_REPORTS[0].netProfit), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 季度报告展开列表 */}
      <div className="space-y-4">
        {QUARTERLY_REPORTS.map((report, index) => (
          <Card key={report.quarter}>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{report.quarter} 季度报告</CardTitle>
                      {index === 0 && <Badge variant="success">最新</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.period} · 发布于 {report.publishDate}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* 财务指标 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-blue-50 p-3 text-center">
                  <p className="text-xs text-gray-500">营业收入</p>
                  <p className="text-sm font-bold text-blue-700 mt-1">{formatCurrency(report.revenue)}</p>
                </div>
                <div className="rounded-xl bg-orange-50 p-3 text-center">
                  <p className="text-xs text-gray-500">运营支出</p>
                  <p className="text-sm font-bold text-orange-700 mt-1">{formatCurrency(report.expenses)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                  <p className="text-xs text-gray-500">净利润</p>
                  <p className="text-sm font-bold text-emerald-700 mt-1">{formatCurrency(report.netProfit)}</p>
                </div>
              </div>

              {/* 运营指标 */}
              <div className="mb-4 rounded-xl bg-gray-50 p-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">入住率</span>
                    <p className="font-semibold text-gray-900">{report.occupancyRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">在院老人</span>
                    <p className="font-semibold text-gray-900">{report.elderCount} 位</p>
                  </div>
                  <div>
                    <span className="text-gray-500">护理人员</span>
                    <p className="font-semibold text-gray-900">{report.staffCount} 名</p>
                  </div>
                </div>
              </div>

              {/* 季度亮点 */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">本季度亮点</p>
                <ul className="space-y-1.5">
                  {report.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
