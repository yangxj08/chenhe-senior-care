import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingCart, Pill, Wrench, Package, Box, Star, InboxIcon } from 'lucide-react'

// 分类配置
const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; label: string; key: string }> = {
  FOOD:        { icon: ShoppingCart, label: '食材',   key: 'FOOD' },
  MEDICINE:    { icon: Pill,         label: '药品',   key: 'MEDICINE' },
  EQUIPMENT:   { icon: Wrench,       label: '设备',   key: 'EQUIPMENT' },
  CONSUMABLE:  { icon: Package,      label: '耗材',   key: 'CONSUMABLE' },
  OTHER:       { icon: Box,          label: '其他',   key: 'OTHER' },
}

const TABS = [
  { label: '全部',   value: '' },
  { label: '食材',   value: 'FOOD' },
  { label: '药品',   value: 'MEDICINE' },
  { label: '设备',   value: 'EQUIPMENT' },
  { label: '耗材',   value: 'CONSUMABLE' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`评分 ${rating} 星`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </span>
  )
}

export default async function SupplyPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const session = await getServerSession(authOptions)
  const orgId = (session?.user as any)?.organizationId as string | undefined

  const { category = '' } = await searchParams

  // 当月起止时间
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const [suppliers, monthlyOrderCount, monthlyAmountAgg] = await Promise.all([
    prisma.supplier.findMany({
      where: { organizationId: orgId ?? '' },
      include: { _count: { select: { purchaseOrders: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.purchaseOrder.count({
      where: {
        organizationId: orgId ?? '',
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.purchaseOrder.aggregate({
      where: {
        organizationId: orgId ?? '',
        createdAt: { gte: monthStart, lte: monthEnd },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalAmount: true },
    }),
  ])

  const activeCount    = suppliers.filter((s) => s.status === 'ACTIVE').length
  const totalCount     = suppliers.length
  const monthlyAmount  = monthlyAmountAgg._sum.totalAmount ?? 0

  // 前端按分类过滤
  const filtered = category
    ? suppliers.filter((s) => s.category === category)
    : suppliers

  const fmtAmount = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthlyAmount)

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">供应链管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理机构采购供应商及采购订单</p>
        </div>
        <Link href="/dashboard/org/supply/orders">
          <Button variant="outline">查看采购订单</Button>
        </Link>
      </div>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">供应商总数</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">活跃供应商</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">本月采购单数</p>
            <p className="text-2xl font-bold text-blue-600">{monthlyOrderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">本月采购金额</p>
            <p className="text-2xl font-bold text-orange-600">{fmtAmount}</p>
          </CardContent>
        </Card>
      </div>

      {/* 分类 Tab */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/dashboard/org/supply?category=${tab.value}` : '/dashboard/org/supply'}
            className={[
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
              category === tab.value
                ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab.label}
            {tab.value && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({suppliers.filter((s) => s.category === tab.value).length})
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* 供应商卡片网格 */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-gray-400">
          <InboxIcon className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-base font-medium">暂无供应商数据</p>
          <p className="text-sm mt-1">
            {category ? '该分类下暂无供应商' : '请先添加供应商'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((supplier) => {
            const cat = CATEGORY_CONFIG[supplier.category] ?? CATEGORY_CONFIG['OTHER']
            const CatIcon = cat.icon
            return (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                        <CatIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">{supplier.name}</CardTitle>
                        <p className="text-xs text-gray-400 mt-0.5">{cat.label}</p>
                      </div>
                    </div>
                    <Badge variant={supplier.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {supplier.status === 'ACTIVE' ? '活跃' : '停用'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {/* 联系人信息 */}
                  <div className="space-y-1 text-sm">
                    {supplier.contactName && (
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-gray-400">联系人</span>
                        <span>{supplier.contactName}</span>
                      </div>
                    )}
                    {supplier.contactPhone && (
                      <div className="flex items-center justify-between text-gray-600">
                        <span className="text-gray-400">联系电话</span>
                        <span>{supplier.contactPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* 星级评分 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">评分</span>
                    <StarRating rating={supplier.rating} />
                  </div>

                  {/* 采购单数量 */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">累计采购单</span>
                    <span className="font-medium text-gray-900">
                      {supplier._count.purchaseOrders} 笔
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="pt-2 border-t border-gray-100">
                    <Link href={`/dashboard/org/supply/orders?supplierId=${supplier.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        查看订单
                      </Button>
                    </Link>
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
