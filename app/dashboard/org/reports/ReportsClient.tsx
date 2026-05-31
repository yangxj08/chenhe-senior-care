'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// Monthly revenue data
const monthlyRevenue = [
  { month: '1月', revenue: 450000 },
  { month: '2月', revenue: 520000 },
  { month: '3月', revenue: 680000 },
  { month: '4月', revenue: 820000 },
  { month: '5月', revenue: 950000 },
  { month: '6月', revenue: 1080000 },
]

// Care level distribution
const careLevelData = [
  { name: 'A级', value: 40, color: '#4ade80' },
  { name: 'B级', value: 35, color: '#60a5fa' },
  { name: 'C级', value: 25, color: '#f97316' },
]

// Cost breakdown
const costData = [
  { name: '人力', value: 63, color: '#6366f1' },
  { name: '餐饮水电', value: 22, color: '#f59e0b' },
  { name: '医疗耗材', value: 9, color: '#10b981' },
  { name: '管理', value: 6, color: '#ec4899' },
]

// Monthly staffing vs elders bar chart data
const operationsData = [
  { month: '1月', elders: 82, staff: 24 },
  { month: '2月', elders: 85, staff: 25 },
  { month: '3月', elders: 91, staff: 26 },
  { month: '4月', elders: 95, staff: 28 },
  { month: '5月', elders: 98, staff: 29 },
  { month: '6月', elders: 104, staff: 31 },
]

function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-blue-600">
          营收：{formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

function OperationsTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}：{entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-gray-600">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const totalRevenue = monthlyRevenue.reduce((sum, d) => sum + d.revenue, 0)
  const avgRevenue = Math.round(totalRevenue / monthlyRevenue.length)
  const latestRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue
  const growthRate = (
    ((latestRevenue - monthlyRevenue[0].revenue) / monthlyRevenue[0].revenue) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">报表统计</h1>
        <p className="text-sm text-gray-500 mt-1">
          机构运营数据可视化分析（近6个月）
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">上半年总营收</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">累计6个月收入</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">月均营收</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(avgRevenue)}
            </p>
            <p className="text-xs text-blue-600 mt-1">近6个月平均值</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">营收增长率</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              +{growthRate}%
            </p>
            <p className="text-xs text-gray-400 mt-1">1月至6月环比增长</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>月度营收趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={monthlyRevenue}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="营收"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operations Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>在院老人 vs 在职员工</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={operationsData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip content={<OperationsTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                />
                <Bar
                  dataKey="elders"
                  name="在院老人"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="staff"
                  name="在职员工"
                  fill="#a78bfa"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Care Level Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>护理等级分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={careLevelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {careLevelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    formatter={(value, entry: any) =>
                      `${value}  ${entry.payload.value}%`
                    }
                    wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>成本结构占比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {costData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value, entry: any) =>
                    `${value}  ${entry.payload.value}%`
                  }
                  wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
