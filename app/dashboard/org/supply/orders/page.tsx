import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrdersTable, type Order } from './OrdersTable'

export default async function PurchaseOrdersPage() {
  const session = await getServerSession(authOptions)
  const orgId = (session?.user as any)?.organizationId as string | undefined

  const orders = await prisma.purchaseOrder.findMany({
    where: { organizationId: orgId ?? '' },
    include: {
      supplier: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // 统计各状态数量
  const countByStatus = (status: string) =>
    orders.filter((o) => o.status === status).length

  const pendingCount   = countByStatus('PENDING')
  const approvedCount  = countByStatus('APPROVED')
  const deliveredCount = countByStatus('DELIVERED')
  const cancelledCount = countByStatus('CANCELLED')

  // 序列化日期为字符串，供客户端组件使用
  const serialized: Order[] = orders.map((o) => ({
    id:           o.id,
    orderNo:      o.orderNo,
    status:       o.status,
    totalAmount:  o.totalAmount,
    orderDate:    o.orderDate.toISOString(),
    expectedDate: o.expectedDate?.toISOString() ?? null,
    supplier: {
      id:       o.supplier.id,
      name:     o.supplier.name,
      category: o.supplier.category,
    },
    items: o.items.map((item) => ({
      id:         item.id,
      itemName:   item.itemName,
      unit:       item.unit,
      quantity:   item.quantity,
      unitPrice:  item.unitPrice,
      totalPrice: item.totalPrice,
    })),
  }))

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">采购订单</h1>
          <p className="text-sm text-gray-500 mt-1">查看并管理所有采购订单及明细</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/org/supply">
            <Button variant="outline">返回供应商</Button>
          </Link>
          <Link href="/dashboard/org/supply/orders/new">
            <Button>+ 新增采购单</Button>
          </Link>
        </div>
      </div>

      {/* 状态统计卡 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-xl">
                ⏳
              </div>
              <div>
                <p className="text-xs text-gray-500">待审批</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                ✅
              </div>
              <div>
                <p className="text-xs text-gray-500">已审批</p>
                <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                📦
              </div>
              <div>
                <p className="text-xs text-gray-500">已到货</p>
                <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                🚫
              </div>
              <div>
                <p className="text-xs text-gray-500">已取消</p>
                <p className="text-2xl font-bold text-gray-500">{cancelledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表（含展开明细交互） */}
      <OrdersTable orders={serialized} />
    </div>
  )
}
