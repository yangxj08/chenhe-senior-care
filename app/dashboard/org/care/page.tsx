import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { Heart, Plus, AlertCircle } from 'lucide-react'

const CARE_RECORD_TYPE_LABELS: Record<string, string> = {
  DAILY: '日常护理',
  MEDICAL: '医疗处置',
  REHABILITATION: '康复训练',
  VITALS: '体征检测',
  DIET: '饮食记录',
  PSYCHOLOGY: '心理疏导',
}

const CARE_RECORD_TYPE_VARIANTS: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
  DAILY: 'default',
  MEDICAL: 'danger',
  REHABILITATION: 'success',
  VITALS: 'info',
  DIET: 'secondary',
  PSYCHOLOGY: 'warning',
}

const MOOD_LABELS: Record<string, string> = {
  GOOD: '良好',
  NORMAL: '一般',
  BAD: '较差',
  ANXIOUS: '焦虑',
}

export default async function CareRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; elderId?: string }>
}) {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as any)?.organizationId

  const { type = '', elderId = '' } = await searchParams

  const records = await prisma.careRecord.findMany({
    where: {
      ...(organizationId ? { organizationId } : {}),
      ...(type ? { type } : {}),
      ...(elderId ? { elderId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      elder: { select: { id: true, name: true, roomNumber: true } },
      nurse: { select: { id: true, name: true } },
    },
  })

  const totalCount = records.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">护理记录</h1>
          <p className="text-sm text-gray-500 mt-1">共 {totalCount} 条记录</p>
        </div>
        <Link href="/dashboard/org/care/new">
          <Button>
            <Plus className="h-4 w-4" />
            新增护理记录
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <form method="get" className="flex gap-3">
          <select
            name="type"
            defaultValue={type}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">全部类型</option>
            {Object.entries(CARE_RECORD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="default">筛选</Button>
          {(type || elderId) && (
            <Link href="/dashboard/org/care">
              <Button variant="ghost">清除</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Timeline */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-gray-400">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-base font-medium">暂无护理记录</p>
          <p className="text-sm mt-1">
            {type ? '该类型暂无护理记录' : '点击右上角「新增护理记录」开始记录'}
          </p>
          {!type && (
            <Link href="/dashboard/org/care/new" className="mt-4">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                新增护理记录
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              护理时间线
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-100" />

              <div className="space-y-5">
                {records.map((record) => (
                  <div key={record.id} className="relative flex gap-5 pl-12">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-3 top-3 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                        record.type === 'MEDICAL' ? 'bg-red-500' :
                        record.type === 'REHABILITATION' ? 'bg-green-500' :
                        record.type === 'VITALS' ? 'bg-purple-500' :
                        record.type === 'DIET' ? 'bg-gray-400' :
                        record.type === 'PSYCHOLOGY' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                    />

                    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                      {/* Record header */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Link
                          href={`/dashboard/org/elders/${record.elder.id}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {record.elder.name}
                        </Link>
                        {record.elder.roomNumber && (
                          <span className="text-xs text-gray-400">{record.elder.roomNumber}室</span>
                        )}
                        <Badge variant={CARE_RECORD_TYPE_VARIANTS[record.type] ?? 'default'}>
                          {CARE_RECORD_TYPE_LABELS[record.type] ?? record.type}
                        </Badge>
                        <span className="ml-auto text-xs text-gray-400">
                          {formatDateTime(record.createdAt)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{record.description}</p>

                      {/* Vitals row */}
                      {(record.temperature || record.bloodPressure || record.pulse || record.mood) && (
                        <div className="flex flex-wrap gap-4 rounded-lg bg-gray-50 px-3 py-2 mb-3">
                          {record.temperature && (
                            <div className="text-xs">
                              <span className="text-gray-400">体温 </span>
                              <span className="font-semibold text-gray-800">{record.temperature}°C</span>
                            </div>
                          )}
                          {record.bloodPressure && (
                            <div className="text-xs">
                              <span className="text-gray-400">血压 </span>
                              <span className="font-semibold text-gray-800">{record.bloodPressure} mmHg</span>
                            </div>
                          )}
                          {record.pulse && (
                            <div className="text-xs">
                              <span className="text-gray-400">脉搏 </span>
                              <span className="font-semibold text-gray-800">{record.pulse} 次/分</span>
                            </div>
                          )}
                          {record.mood && (
                            <div className="text-xs">
                              <span className="text-gray-400">情绪 </span>
                              <span className="font-semibold text-gray-800">{MOOD_LABELS[record.mood] ?? record.mood}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <p className="text-xs text-gray-400">
                        护理人员：{record.nurse.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
