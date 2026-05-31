'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'recharts'

const monthlyRevenueData = [
  { month: '1月', revenue: 128000 },
  { month: '2月', revenue: 145000 },
  { month: '3月', revenue: 162000 },
  { month: '4月', revenue: 158000 },
  { month: '5月', revenue: 175000 },
  { month: '6月', revenue: 192000 },
  { month: '7月', revenue: 188000 },
  { month: '8月', revenue: 210000 },
  { month: '9月', revenue: 225000 },
  { month: '10月', revenue: 218000 },
  { month: '11月', revenue: 240000 },
  { month: '12月', revenue: 265000 },
]

const occupancyData = [
  { name: '阳光老年公寓', occupancy: 88 },
  { name: '幸福颐养院', occupancy: 75 },
  { name: '康乐护理中心', occupancy: 92 },
  { name: '怡然居养老院', occupancy: 65 },
  { name: '春晖养老服务', occupancy: 80 },
  { name: '安康护理院', occupancy: 70 },
]

const roleDistributionData = [
  { name: '机构管理员', value: 32, color: '#3b82f6' },
  { name: '护理人员', value: 85, color: '#10b981' },
  { name: '家属', value: 124, color: '#f59e0b' },
  { name: '投资人', value: 18, color: '#8b5cf6' },
  { name: '超级管理员', value: 3, color: '#ef4444' },
]

function formatYAxis(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万`
  }
  return String(value)
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function RevenueTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-blue-600">
        营收：¥{(payload[0].value / 10000).toFixed(1)}万
      </p>
    </div>
  )
}

function OccupancyTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-emerald-600">入住率：{payload[0].value}%</p>
    </div>
  )
}

function PieTooltipContent({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-medium text-gray-700 mb-1">{payload[0].name}</p>
      <p style={{ color: payload[0].color }}>人数：{payload[0].value}</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const totalUsers = roleDistributionData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
        <p className="text-sm text-gray-500 mt-1">平台关键指标可视化分析</p>
      </div>

      {/* Monthly Revenue Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>月度营收趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyRevenueData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Occupancy Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>机构入住率</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={occupancyData}
                margin={{ top: 8, right: 16, left: 8, bottom: 40 }}
                barSize={28}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<OccupancyTooltip />} />
                <Bar dataKey="occupancy" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>用户角色分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={240}>
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {roleDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((item.value / totalUsers) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">合计</span>
                  <span className="text-sm font-bold text-gray-900">{totalUsers} 人</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
