'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

// ─── 类型 ───────────────────────────────────────────────────────

export interface OrderItem {
  id: string
  itemName: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  orderDate: string | Date
  expectedDate?: string | Date | null
  supplier: {
    id: string
    name: string
    category: string
  }
  items: OrderItem[]
}

// ─── 常量 ───────────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, string> = {
  FOOD:       '🍎',
  MEDICINE:   '💊',
  EQUIPMENT:  '🏥',
  CONSUMABLE: '📦',
  OTHER:      '🔧',
}

type BadgeVariant = 'warning' | 'default' | 'success' | 'secondary'

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING:   { label: '待审批', variant: 'warning' },
  APPROVED:  { label: '已审批', variant: 'default' },
  DELIVERED: { label: '已到货', variant: 'success' },
  CANCELLED: { label: '已取消', variant: 'secondary' },
}

// ─── 组件 ───────────────────────────────────────────────────────

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-16 text-gray-400">
        <span className="text-4xl mb-3">📋</span>
        <p className="text-base font-medium">暂无采购订单</p>
        <p className="text-sm mt-1">点击右上角「新增采购单」创建第一笔订单</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* 表头 */}
      <div className="hidden sm:grid grid-cols-[1fr_1.2fr_52px_120px_100px_110px_100px_52px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <span>订单号</span>
        <span>供应商</span>
        <span>类型</span>
        <span>订单总额</span>
        <span>下单日期</span>
        <span>预计到货</span>
        <span>状态</span>
        <span></span>
      </div>

      {/* 订单行 */}
      <div className="divide-y divide-gray-100">
        {orders.map((order) => {
          const isExpanded = expandedIds.has(order.id)
          const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' as const }
          const catIcon = CATEGORY_ICON[order.supplier.category] ?? '🔧'

          return (
            <div key={order.id}>
              {/* 主行 */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_52px_120px_100px_110px_100px_52px] gap-2 sm:gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-colors">
                {/* 订单号 */}
                <div>
                  <p className="text-xs text-gray-400 sm:hidden">订单号</p>
                  <p className="font-mono text-sm font-medium text-gray-900">{order.orderNo}</p>
                </div>

                {/* 供应商 */}
                <div>
                  <p className="text-xs text-gray-400 sm:hidden">供应商</p>
                  <p className="text-sm text-gray-900">{order.supplier.name}</p>
                </div>

                {/* 分类图标 */}
                <div className="text-xl" title={order.supplier.category}>
                  {catIcon}
                </div>

                {/* 订单总额 */}
                <div>
                  <p className="text-xs text-gray-400 sm:hidden">总额</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                {/* 下单日期 */}
                <div>
                  <p className="text-xs text-gray-400 sm:hidden">下单日期</p>
                  <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                </div>

                {/* 预计到货 */}
                <div>
                  <p className="text-xs text-gray-400 sm:hidden">预计到货</p>
                  <p className="text-sm text-gray-600">
                    {order.expectedDate ? formatDate(order.expectedDate) : '—'}
                  </p>
                </div>

                {/* 状态 */}
                <div>
                  <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                </div>

                {/* 展开按钮 */}
                <div>
                  {order.items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(order.id)}
                      aria-expanded={isExpanded}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                      title={isExpanded ? '收起明细' : '展开明细'}
                    >
                      <span className="text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 展开明细 */}
              {isExpanded && order.items.length > 0 && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-3 mb-2">
                    订单明细（共 {order.items.length} 项）
                  </p>
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">品名</th>
                          <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">单位</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">数量</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">单价</th>
                          <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">小计</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">{item.itemName}</td>
                            <td className="px-3 py-2 text-center text-gray-500">{item.unit}</td>
                            <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
                            <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900">{formatCurrency(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200 bg-gray-50">
                          <td colSpan={4} className="px-3 py-2 text-sm font-medium text-gray-600 text-right">
                            合计
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
