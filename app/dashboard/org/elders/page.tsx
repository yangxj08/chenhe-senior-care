import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, CARE_LEVELS } from '@/lib/utils'
import type { CareLevelKey } from '@/lib/utils'
import Link from 'next/link'
import { Users, UserPlus, AlertCircle } from 'lucide-react'

export default async function EldersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; careLevel?: string }>
}) {
  const session = await getServerSession(authOptions)
  const organizationId = (session?.user as any)?.organizationId

  const { search = '', careLevel = '' } = await searchParams

  const whereClause = {
    ...(organizationId ? { organizationId } : {}),
    ...(careLevel ? { careLevel } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { roomNumber: { contains: search } },
          ],
        }
      : {}),
  }

  const [elders, totalCount, levelCounts] = await Promise.all([
    prisma.elder.findMany({
      where: whereClause,
      orderBy: { admissionDate: 'desc' },
    }),
    prisma.elder.count({ where: { organizationId: organizationId ?? '' } }),
    prisma.elder.groupBy({
      by: ['careLevel'],
      where: { organizationId: organizationId ?? '' },
      _count: true,
    }),
  ])

  const levelCountMap: Record<string, number> = {}
  levelCounts.forEach((item) => {
    levelCountMap[item.careLevel] = item._count
  })

  const careLevelBadgeVariant = (level: string) => {
    if (level === 'A') return 'success'
    if (level === 'B') return 'default'
    if (level === 'C') return 'warning'
    if (level === 'D') return 'info'
    return 'secondary'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">老人管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理机构内所有入住老人信息</p>
        </div>
        <Link href="/dashboard/org/elders/new">
          <Button>
            <UserPlus className="h-4 w-4" />
            新增老人
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">全部</p>
                <p className="text-xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {(['A', 'B', 'C', 'D'] as const).map((level) => (
          <Card key={level}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Badge variant={careLevelBadgeVariant(level)} className="h-10 w-10 flex items-center justify-center rounded-xl text-base font-bold">
                  {level}
                </Badge>
                <div>
                  <p className="text-xs text-gray-500">{CARE_LEVELS[level as CareLevelKey]?.label}</p>
                  <p className="text-xl font-bold text-gray-900">{levelCountMap[level] ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form className="flex flex-1 gap-3" method="get">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="搜索姓名或房间号..."
            className="flex h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <select
            name="careLevel"
            defaultValue={careLevel}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">全部等级</option>
            <option value="A">A级 - 自理</option>
            <option value="B">B级 - 半自理</option>
            <option value="C">C级 - 不自理</option>
            <option value="D">D级 - 特护</option>
          </select>
          <Button type="submit" variant="outline">搜索</Button>
          {(search || careLevel) && (
            <Link href="/dashboard/org/elders">
              <Button variant="ghost">清除</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Elder Grid */}
      {elders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-gray-400">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-base font-medium">暂无老人数据</p>
          <p className="text-sm mt-1">
            {search || careLevel ? '没有符合筛选条件的老人' : '点击右上角「新增老人」开始录入'}
          </p>
          {!search && !careLevel && (
            <Link href="/dashboard/org/elders/new" className="mt-4">
              <Button size="sm">
                <UserPlus className="h-4 w-4" />
                新增老人
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {elders.map((elder) => (
            <Card key={elder.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                      {elder.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{elder.name}</p>
                      <p className="text-xs text-gray-500">
                        {elder.gender} · {elder.age}岁
                      </p>
                    </div>
                  </div>
                  <Badge variant={careLevelBadgeVariant(elder.careLevel)}>
                    {elder.careLevel}级 · {CARE_LEVELS[elder.careLevel as CareLevelKey]?.label ?? elder.careLevel}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">房间</span>
                    <span>{elder.roomNumber ? `${elder.roomNumber}室` : '未分配'}{elder.bedNumber ? ` · ${elder.bedNumber}床` : ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">入住日期</span>
                    <span>{formatDate(elder.admissionDate)}</span>
                  </div>
                  {elder.emergencyContact && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">紧急联系</span>
                      <span>{elder.emergencyContact}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/dashboard/org/elders/${elder.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">详情</Button>
                  </Link>
                  <Link href={`/dashboard/org/elders/${elder.id}/edit`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">编辑</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
