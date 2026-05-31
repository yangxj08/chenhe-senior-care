import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, UserPlus, AlertCircle, Briefcase, HeartPulse, Wrench } from 'lucide-react'

// 部门配置
const DEPARTMENTS = [
  { key: '', label: '全部', icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
  { key: '护理部', label: '护理部', icon: HeartPulse, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { key: '管理部', label: '管理部', icon: Briefcase, bg: 'bg-purple-50', text: 'text-purple-600' },
  { key: '后勤部', label: '后勤部', icon: Wrench, bg: 'bg-orange-50', text: 'text-orange-600' },
]

// 部门 Badge 颜色映射
const DEPT_BADGE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary' | 'danger'> = {
  护理部: 'success',
  管理部: 'info',
  后勤部: 'warning',
  医疗部: 'default',
  财务部: 'secondary',
  行政部: 'secondary',
}

// 头像背景色（按部门）
const DEPT_AVATAR_COLOR: Record<string, string> = {
  护理部: 'from-emerald-400 to-emerald-600',
  管理部: 'from-purple-400 to-purple-600',
  后勤部: 'from-orange-400 to-orange-600',
  医疗部: 'from-blue-400 to-blue-600',
  财务部: 'from-teal-400 to-teal-600',
  行政部: 'from-indigo-400 to-indigo-600',
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>
}) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role as string
  const orgId = (session?.user as any)?.organizationId as string

  // 护理人员无权限访问员工管理
  if (role === 'NURSE') {
    const { redirect } = await import('next/navigation')
    redirect('/dashboard/org')
  }

  const { department = '' } = await searchParams

  // 主查询：带 user 关联，按入职日期倒序
  const staffList = await prisma.staffMember.findMany({
    where: {
      organizationId: orgId,
      ...(department ? { department } : {}),
    },
    include: { user: true },
    orderBy: { joinDate: 'desc' },
  })

  // 各部门人数统计（全量，不受 Tab 筛选影响）
  const allStaff = await prisma.staffMember.findMany({
    where: { organizationId: orgId },
    select: { department: true },
  })

  const totalCount = allStaff.length
  const nurseCount = allStaff.filter((s) => s.department === '护理部').length
  const adminCount = allStaff.filter((s) => s.department === '管理部').length
  const logisticsCount = allStaff.filter((s) => s.department === '后勤部').length

  const isOrgAdmin = role === 'ORG_ADMIN'

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">员工管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理机构在职员工档案信息，共 <span className="font-semibold text-gray-700">{totalCount}</span> 位员工
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4" />
          新增员工
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* 总员工数 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">员工总数</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 护理部 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 flex-shrink-0">
                <HeartPulse className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">护理部</p>
                <p className="text-2xl font-bold text-gray-900">{nurseCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 管理部 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 flex-shrink-0">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">管理部</p>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 后勤部 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 flex-shrink-0">
                <Wrench className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">后勤部</p>
                <p className="text-2xl font-bold text-gray-900">{logisticsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 部门 Tab 筛选 */}
      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((dept) => {
          const isActive = department === dept.key
          return (
            <Link
              key={dept.key}
              href={dept.key ? `/dashboard/org/staff?department=${encodeURIComponent(dept.key)}` : '/dashboard/org/staff'}
            >
              <button
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {dept.label}
              </button>
            </Link>
          )
        })}
      </div>

      {/* 员工卡片列表 */}
      {staffList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-gray-400">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-base font-medium text-gray-500">暂无员工数据</p>
          <p className="text-sm mt-1 text-gray-400">
            {department ? `${department} 下暂无员工` : '点击右上角「新增员工」开始录入'}
          </p>
          {!department && (
            <div className="mt-4">
              <Button size="sm">
                <UserPlus className="h-4 w-4" />
                新增员工
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {staffList.map((staff) => {
            const avatarLetter = staff.user.name.charAt(0)
            const avatarGradient = DEPT_AVATAR_COLOR[staff.department] ?? 'from-blue-400 to-blue-600'
            const deptVariant = DEPT_BADGE_VARIANT[staff.department] ?? 'default'

            return (
              <Card key={staff.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  {/* 头像 + 姓名 + 岗位 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={[
                        'flex h-14 w-14 items-center justify-center rounded-full',
                        'bg-gradient-to-br text-white font-bold text-xl flex-shrink-0',
                        avatarGradient,
                      ].join(' ')}
                    >
                      {avatarLetter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate text-base">{staff.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{staff.position}</p>
                    </div>
                    <Badge variant={deptVariant} className="flex-shrink-0">
                      {staff.department}
                    </Badge>
                  </div>

                  {/* 详细信息 */}
                  <div className="space-y-2 text-sm mb-4">
                    {/* 联系电话 */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">联系电话</span>
                      <span className="text-gray-700 font-medium">
                        {staff.user.phone ?? '—'}
                      </span>
                    </div>

                    {/* 入职日期 */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">入职日期</span>
                      <span className="text-gray-700">{formatDate(staff.joinDate)}</span>
                    </div>

                    {/* 薪资 — 仅 ORG_ADMIN 可见 */}
                    {isOrgAdmin && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">月薪</span>
                        <span className="text-gray-700 font-medium tabular-nums">
                          {staff.salary != null ? formatCurrency(staff.salary) : '未设置'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1">
                      查看详情
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      编辑
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
