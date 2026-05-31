import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  AlertCircle,
  Eye,
  Handshake,
  CheckCircle2,
  XCircle,
  TrendingUp,
  CalendarClock,
  Pencil,
  PlusCircle,
} from 'lucide-react'

// ── 状态配置 ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'secondary' | 'default' | 'warning' | 'success' | 'danger'; icon: React.ElementType }
> = {
  LEAD:        { label: '线索',  variant: 'secondary', icon: Users },
  VISITING:    { label: '参观中', variant: 'default',   icon: Eye },
  NEGOTIATING: { label: '谈判中', variant: 'warning',   icon: Handshake },
  SIGNED:      { label: '已签约', variant: 'success',   icon: CheckCircle2 },
  LOST:        { label: '已失单', variant: 'danger',    icon: XCircle },
}

// 状态 Tab 顺序
const STATUS_TABS = [
  { key: '',            label: '全部' },
  { key: 'LEAD',        label: '线索' },
  { key: 'VISITING',    label: '参观中' },
  { key: 'NEGOTIATING', label: '谈判中' },
  { key: 'SIGNED',      label: '已签约' },
  { key: 'LOST',        label: '已失单' },
]

// ── 来源渠道中文映射 ──────────────────────────────────────────────
const SOURCE_MAP: Record<string, string> = {
  REFERRAL: '老客户介绍',
  WALK_IN:  '自然来访',
  ONLINE:   '线上咨询',
  HOSPITAL: '医院转介',
  GOV:      '政府转介',
}

// 护理需求 Badge variant
const CARE_NEED_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  A: 'success',
  B: 'warning',
  C: 'danger',
}

// 护理需求中文
const CARE_NEED_LABEL: Record<string, string> = {
  A: 'A级·自理',
  B: 'B级·半自理',
  C: 'C级·不自理',
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getServerSession(authOptions)
  const orgId = (session?.user as any)?.organizationId as string

  const { status = '' } = await searchParams

  // 当前 Tab 显示的客户列表
  const customers = await prisma.customer.findMany({
    where: {
      organizationId: orgId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  // 销售漏斗统计（全量）
  const allCustomers = await prisma.customer.findMany({
    where: { organizationId: orgId },
    select: { status: true },
  })

  const countByStatus = (s: string) => allCustomers.filter((c) => c.status === s).length
  const totalCount      = allCustomers.length
  const leadCount       = countByStatus('LEAD')
  const visitingCount   = countByStatus('VISITING')
  const negotiateCount  = countByStatus('NEGOTIATING')
  const signedCount     = countByStatus('SIGNED')

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理意向客户及跟进记录，共{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> 位客户
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4" />
          新增意向客户
        </Button>
      </div>

      {/* 销售漏斗统计卡 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* 线索 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">线索</p>
                <p className="text-2xl font-bold text-gray-900">{leadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 参观 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">参观</p>
                <p className="text-2xl font-bold text-gray-900">{visitingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 谈判 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">谈判</p>
                <p className="text-2xl font-bold text-gray-900">{negotiateCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 已签约 */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">已签约</p>
                <p className="text-2xl font-bold text-gray-900">{signedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 状态 Tab 筛选 */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.key
          return (
            <Link
              key={tab.key}
              href={
                tab.key
                  ? `/dashboard/org/customers?status=${tab.key}`
                  : '/dashboard/org/customers'
              }
            >
              <button
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ].join(' ')}
              >
                {tab.label}
                {tab.key === '' && totalCount > 0 && (
                  <span
                    className={[
                      'ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold',
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600',
                    ].join(' ')}
                  >
                    {totalCount}
                  </span>
                )}
              </button>
            </Link>
          )
        })}
      </div>

      {/* 客户列表 */}
      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-gray-400">
          <AlertCircle className="h-12 w-12 mb-3" />
          <p className="text-base font-medium text-gray-500">暂无客户数据</p>
          <p className="text-sm mt-1 text-gray-400">
            {status
              ? `当前状态「${STATUS_CONFIG[status]?.label ?? status}」下暂无客户`
              : '点击右上角「新增意向客户」开始录入'}
          </p>
          {!status && (
            <div className="mt-4">
              <Button size="sm">
                <UserPlus className="h-4 w-4" />
                新增意向客户
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              {status ? `${STATUS_CONFIG[status]?.label ?? status}客户` : '全部客户'}
              <span className="ml-2 text-sm font-normal text-gray-400">
                {customers.length} 条记录
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* 桌面端表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      客户 / 联系电话
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      意向老人
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      护理需求
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      预算区间
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      来源渠道
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      跟进人
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                      下次跟进
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 whitespace-nowrap">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((customer) => {
                    const statusCfg = STATUS_CONFIG[customer.status] ?? {
                      label: customer.status,
                      variant: 'secondary' as const,
                      icon: Users,
                    }

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* 客户姓名 + 电话 */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {customer.phone ?? '—'}
                          </p>
                        </td>

                        {/* 意向老人 */}
                        <td className="px-4 py-4">
                          {customer.elderName ? (
                            <>
                              <p className="text-gray-800 font-medium">{customer.elderName}</p>
                              {customer.elderAge != null && (
                                <p className="text-xs text-gray-400 mt-0.5">{customer.elderAge} 岁</p>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* 护理需求 */}
                        <td className="px-4 py-4">
                          {customer.careNeed ? (
                            <Badge variant={CARE_NEED_VARIANT[customer.careNeed] ?? 'secondary'}>
                              {CARE_NEED_LABEL[customer.careNeed] ?? customer.careNeed}
                            </Badge>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* 预算区间 */}
                        <td className="px-4 py-4 text-gray-700">
                          {customer.budget ?? <span className="text-gray-300">—</span>}
                        </td>

                        {/* 来源渠道 */}
                        <td className="px-4 py-4 text-gray-600">
                          {customer.source
                            ? SOURCE_MAP[customer.source] ?? customer.source
                            : <span className="text-gray-300">—</span>}
                        </td>

                        {/* 状态 Badge */}
                        <td className="px-4 py-4">
                          <Badge variant={statusCfg.variant}>
                            {statusCfg.label}
                          </Badge>
                        </td>

                        {/* 跟进人 */}
                        <td className="px-4 py-4 text-gray-700">
                          {customer.assignedTo ?? <span className="text-gray-300">—</span>}
                        </td>

                        {/* 下次跟进日期 */}
                        <td className="px-4 py-4">
                          {customer.followUpDate ? (
                            <span className="flex items-center gap-1 text-gray-600 whitespace-nowrap">
                              <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                              {formatDate(customer.followUpDate)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* 操作 */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs">
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              编辑
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <PlusCircle className="h-3.5 w-3.5 mr-1" />
                              跟进记录
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
