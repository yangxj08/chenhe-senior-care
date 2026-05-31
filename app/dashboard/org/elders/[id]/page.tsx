import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime, formatCurrency, CARE_LEVELS, BILLING_STATUS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Phone, Heart, CreditCard, Clock } from 'lucide-react'

const CARE_RECORD_TYPE_LABELS: Record<string, string> = {
  DAILY: '日常护理',
  MEDICAL: '医疗处置',
  REHABILITATION: '康复训练',
  VITALS: '体征检测',
  DIET: '饮食记录',
  PSYCHOLOGY: '心理疏导',
}

const MOOD_LABELS: Record<string, string> = {
  GOOD: '良好',
  NORMAL: '一般',
  BAD: '较差',
  ANXIOUS: '焦虑',
}

export default async function ElderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as any)?.organizationId
  const role = (session?.user as any)?.role as string
  const isAdmin = role === 'ORG_ADMIN' || role === 'SUPER_ADMIN'
  const { id } = await params

  const elder = await prisma.elder.findUnique({
    where: { id },
    include: {
      careRecords: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          nurse: { select: { name: true } },
        },
      },
      billings: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!elder || elder.organizationId !== organizationId) {
    notFound()
  }

  const careLevelInfo = CARE_LEVELS[elder.careLevel as CareLevelKey]
  const careLevelVariant =
    elder.careLevel === 'A' ? 'success' :
    elder.careLevel === 'B' ? 'default' :
    elder.careLevel === 'C' ? 'warning' : 'info'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/org/elders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{elder.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">老人详情</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/org/elders/${elder.id}/edit`}>
            <Button variant="outline">编辑信息</Button>
          </Link>
          <Link href="/dashboard/org/care/new">
            <Button>
              <Heart className="h-4 w-4" />
              新增护理记录
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: basic info */}
        <div className="space-y-5 lg:col-span-1">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-3xl mb-3">
                  {elder.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{elder.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{elder.gender} · {elder.age}岁</p>
                <div className="mt-2">
                  <Badge variant={careLevelVariant}>
                    {elder.careLevel}级 · {careLevelInfo?.label ?? elder.careLevel}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-400">身份证</span>
                  <span className="ml-auto font-mono text-xs">{elder.idCard || '未填写'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-400">手机</span>
                  <span className="ml-auto">{elder.phone || '未填写'}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400">紧急联系人</span>
                  <span>{elder.emergencyContact || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400">紧急电话</span>
                  <span>{elder.emergencyPhone || '-'}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400">房间</span>
                  <span>
                    {elder.roomNumber ? `${elder.roomNumber}室` : '未分配'}
                    {elder.bedNumber ? ` · ${elder.bedNumber}床` : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-gray-400">入住日期</span>
                  <span>{formatDate(elder.admissionDate)}</span>
                </div>
                {elder.notes && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <p className="text-gray-400 mb-1">备注</p>
                      <p className="text-gray-700 text-xs leading-relaxed">{elder.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing Summary — 仅管理员可见 */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  账单摘要
                </CardTitle>
              </CardHeader>
              <CardContent>
                {elder.billings.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">暂无账单记录</p>
                ) : (
                  <div className="space-y-3">
                    {elder.billings.map((bill) => (
                      <div key={bill.id} className="rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{bill.month}</span>
                          <Badge
                            variant={
                              bill.status === 'PAID' ? 'success' :
                              bill.status === 'OVERDUE' ? 'warning' : 'danger'
                            }
                          >
                            {BILLING_STATUS[bill.status as keyof typeof BILLING_STATUS]?.label ?? bill.status}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(bill.total)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: care records timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                最近护理记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              {elder.careRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Heart className="h-10 w-10 mb-3" />
                  <p className="text-sm">暂无护理记录</p>
                  <Link href="/dashboard/org/care/new" className="mt-3">
                    <Button size="sm" variant="outline">添加护理记录</Button>
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
                  <div className="space-y-4">
                    {elder.careRecords.map((record, index) => (
                      <div key={record.id} className="relative flex gap-4 pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-2 top-2 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-sm" />

                        <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="default">
                              {CARE_RECORD_TYPE_LABELS[record.type] ?? record.type}
                            </Badge>
                            <span className="text-xs text-gray-400">{formatDateTime(record.createdAt)}</span>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{record.description}</p>

                          {/* Vitals */}
                          {(record.temperature || record.bloodPressure || record.pulse || record.mood) && (
                            <div className="flex flex-wrap gap-3 mb-2">
                              {record.temperature && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="text-gray-400">体温</span>
                                  <span className="font-medium text-gray-700">{record.temperature}°C</span>
                                </div>
                              )}
                              {record.bloodPressure && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="text-gray-400">血压</span>
                                  <span className="font-medium text-gray-700">{record.bloodPressure}</span>
                                </div>
                              )}
                              {record.pulse && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="text-gray-400">脉搏</span>
                                  <span className="font-medium text-gray-700">{record.pulse}次/分</span>
                                </div>
                              )}
                              {record.mood && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="text-gray-400">情绪</span>
                                  <span className="font-medium text-gray-700">{MOOD_LABELS[record.mood] ?? record.mood}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-400">护理人：{record.nurse.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
