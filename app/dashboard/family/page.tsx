import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, CARE_LEVELS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import {
  Heart,
  AlertCircle,
  CreditCard,
  MessageSquare,
  ChevronRight,
  User,
  BedDouble,
  Activity,
  Info,
} from 'lucide-react'

export default async function FamilyHomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const elder = await prisma.elder.findFirst({
    where: { familyUserId: userId },
    include: {
      careRecords: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { nurse: { select: { name: true } } },
      },
      billings: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!elder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <Info className="h-10 w-10 text-amber-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">尚未关联家人信息</h2>
        <p className="text-gray-500 max-w-sm leading-relaxed">
          请联系机构管理员关联您的家人信息，关联后即可查看护理状态、账单及与机构沟通。
        </p>
        <Link href="/dashboard/family/messages">
          <Button variant="outline">联系机构工作人员</Button>
        </Link>
      </div>
    )
  }

  const latestBilling = elder.billings[0]
  const isUnpaid = latestBilling?.status === 'UNPAID'
  const careLevel = elder.careLevel as CareLevelKey
  const careLevelInfo = CARE_LEVELS[careLevel]

  return (
    <div className="space-y-6">
      {/* 温馨问候横幅 */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-400 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-rose-200 text-sm">您好，{session.user?.name}</p>
            <h1 className="text-2xl font-bold mt-1">家属服务中心</h1>
            <p className="text-rose-100 text-sm mt-1">随时了解长辈的护理与生活状态</p>
          </div>
          <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* 老人状态大卡 */}
      <Card className="border-rose-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <User className="h-5 w-5 text-rose-500" />
            长辈状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-2xl font-bold text-rose-600">
              {elder.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{elder.name}</h2>
                <Badge
                  variant={
                    careLevel === 'A' ? 'success' :
                    careLevel === 'B' ? 'warning' :
                    careLevel === 'C' ? 'danger' : 'info'
                  }
                >
                  {careLevelInfo?.label ?? careLevel}级护理
                </Badge>
                <Badge variant={elder.status === 'ACTIVE' ? 'success' : 'secondary'}>
                  {elder.status === 'ACTIVE' ? '在院' : '离院'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4 text-gray-400" />
                  {elder.roomNumber ? `${elder.roomNumber} 室` : '未分配房间'}
                  {elder.bedNumber ? ` · ${elder.bedNumber} 号床` : ''}
                </span>
                <span>{elder.gender} · {elder.age} 岁</span>
                <span>
                  入住：{new Date(elder.admissionDate).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {elder.notes && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  备注：{elder.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 今日护理简报 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Activity className="h-5 w-5 text-blue-500" />
              最新护理记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {elder.careRecords.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <Activity className="h-8 w-8 mb-2" />
                <p className="text-sm">暂无护理记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {elder.careRecords.slice(0, 2).map((record) => (
                  <div
                    key={record.id}
                    className="rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="default">{record.type}</Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{record.description}</p>
                    {(record.temperature || record.bloodPressure) && (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-gray-500">
                        {record.temperature && <span>体温 {record.temperature}℃</span>}
                        {record.bloodPressure && <span>血压 {record.bloodPressure}</span>}
                        {record.pulse && <span>脉搏 {record.pulse} bpm</span>}
                        {record.mood && <span>情绪：{record.mood}</span>}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">护理员：{record.nurse.name}</p>
                  </div>
                ))}
                <Link
                  href="/dashboard/family/elder"
                  className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
                >
                  查看全部记录
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 账单提醒 + 快捷操作 */}
        <div className="space-y-4">
          {/* 账单提醒 */}
          <Card className={isUnpaid ? 'border-red-200' : 'border-green-100'}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isUnpaid ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <CreditCard
                    className={`h-5 w-5 ${isUnpaid ? 'text-red-600' : 'text-green-600'}`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {isUnpaid ? '账单提醒' : '账单状态'}
                  </p>
                  {latestBilling ? (
                    <>
                      <p
                        className={`text-sm mt-0.5 ${
                          isUnpaid ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {latestBilling.month} 账单：{formatCurrency(latestBilling.total)}
                        {isUnpaid ? '（待缴纳）' : '（已缴清）'}
                      </p>
                      {isUnpaid && (
                        <p className="text-xs text-gray-400 mt-0.5">请尽快完成缴费，避免影响服务</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 mt-0.5">暂无账单记录</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800 text-sm">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/family/elder">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  查看护理详情
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
              </Link>
              <Link href="/dashboard/family/billing">
                <Button
                  variant="outline"
                  className={`w-full justify-start gap-2 ${
                    isUnpaid ? 'border-red-200 text-red-600 hover:bg-red-50' : ''
                  }`}
                >
                  <CreditCard className={`h-4 w-4 ${isUnpaid ? 'text-red-500' : 'text-emerald-500'}`} />
                  {isUnpaid ? '立即缴费' : '查看账单'}
                  {isUnpaid && (
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 ml-1" />
                  )}
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
              </Link>
              <Link href="/dashboard/family/messages">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  发消息给机构
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
