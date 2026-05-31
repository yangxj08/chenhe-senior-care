import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, CARE_LEVELS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Scale,
  Smile,
  AlertCircle,
  User,
  Clock,
} from 'lucide-react'

export default async function ElderDetailPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const elder = await prisma.elder.findFirst({
    where: { familyUserId: userId },
    include: {
      careRecords: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { nurse: { select: { name: true } } },
      },
    },
  })

  if (!elder) redirect('/dashboard/family')

  const careLevel = elder.careLevel as CareLevelKey
  const careLevelInfo = CARE_LEVELS[careLevel]

  // 最新一条有数据的健康记录
  const latestHealth = elder.careRecords.find(
    (r) => r.temperature || r.bloodPressure || r.pulse || r.weight
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">老人状态详情</h1>
        <p className="text-sm text-gray-500 mt-1">{elder.name} 的护理记录与健康数据</p>
      </div>

      {/* 基本信息卡 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-rose-500" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-2xl font-bold text-rose-600">
              {elder.name.charAt(0)}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 flex-1">
              {[
                { label: '姓名', value: elder.name },
                { label: '性别', value: elder.gender },
                { label: '年龄', value: `${elder.age} 岁` },
                { label: '护理等级', value: careLevelInfo?.label ?? careLevel },
                { label: '房间/床位', value: `${elder.roomNumber ?? '—'} 室 · ${elder.bedNumber ?? '—'} 号床` },
                { label: '入住日期', value: formatDate(elder.admissionDate) },
                { label: '紧急联系人', value: elder.emergencyContact ?? '—' },
                { label: '紧急电话', value: elder.emergencyPhone ?? '—' },
                { label: '在院状态', value: elder.status === 'ACTIVE' ? '在院' : '离院' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          {elder.notes && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs text-amber-700 font-medium">护理备注</p>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">{elder.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 健康数据展示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            最新健康数据
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latestHealth ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: '体温',
                  value: latestHealth.temperature ? `${latestHealth.temperature} ℃` : '—',
                  icon: Thermometer,
                  color: 'text-orange-600',
                  bg: 'bg-orange-50',
                  normal: latestHealth.temperature ? latestHealth.temperature <= 37.3 : null,
                },
                {
                  label: '血压',
                  value: latestHealth.bloodPressure ?? '—',
                  icon: Activity,
                  color: 'text-red-600',
                  bg: 'bg-red-50',
                  normal: null,
                },
                {
                  label: '脉搏',
                  value: latestHealth.pulse ? `${latestHealth.pulse} bpm` : '—',
                  icon: Droplets,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  normal: latestHealth.pulse ? latestHealth.pulse >= 60 && latestHealth.pulse <= 100 : null,
                },
                {
                  label: '体重',
                  value: latestHealth.weight ? `${latestHealth.weight} kg` : '—',
                  icon: Scale,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                  normal: null,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className={`rounded-xl p-4 text-center ${item.bg}`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${item.color}`} />
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
                    {item.normal !== null && (
                      <p className={`text-xs mt-1 ${item.normal ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.normal ? '正常' : '偏高'}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-gray-400">
              <Activity className="h-8 w-8 mb-2" />
              <p className="text-sm">暂无健康数据记录</p>
            </div>
          )}
          {latestHealth && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              记录时间：{new Date(latestHealth.createdAt).toLocaleDateString('zh-CN')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 护理记录时间线 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            护理记录时间线
          </CardTitle>
        </CardHeader>
        <CardContent>
          {elder.careRecords.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">暂无护理记录</p>
            </div>
          ) : (
            <div className="relative">
              {/* 时间线左侧轴 */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />
              <div className="space-y-4 pl-11">
                {elder.careRecords.map((record, index) => (
                  <div key={record.id} className="relative">
                    {/* 时间线圆点 */}
                    <div
                      className={`absolute -left-7 mt-1.5 h-3 w-3 rounded-full border-2 border-white ${
                        index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                    <div className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{record.type}</Badge>
                          {record.mood && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Smile className="h-3.5 w-3.5" />
                              {record.mood}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(record.createdAt).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.description}</p>
                      {(record.temperature || record.bloodPressure || record.pulse) && (
                        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-500">
                          {record.temperature && <span>体温 {record.temperature}℃</span>}
                          {record.bloodPressure && <span>血压 {record.bloodPressure}</span>}
                          {record.pulse && <span>脉搏 {record.pulse} bpm</span>}
                          {record.weight && <span>体重 {record.weight}kg</span>}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1.5">护理员：{record.nurse.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
