'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, CheckCircle2, AlertCircle, Receipt, Loader2 } from 'lucide-react'

interface BillingRecord {
  id: string
  month: string
  baseFee: number
  careFee: number
  medicineFee: number
  otherFee: number
  total: number
  status: string
  paidAt: string | null
}

interface ElderWithBillings {
  id: string
  name: string
  billings: BillingRecord[]
}

export default function BillingPage() {
  const [elder, setElder] = useState<ElderWithBillings | null>(null)
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [billings, setBillings] = useState<BillingRecord[]>([])

  useEffect(() => {
    fetch('/api/family/elder')
      .then((r) => r.json())
      .then((data) => {
        if (data.elder) {
          setElder(data.elder)
          setBillings(data.elder.billings ?? [])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handlePay(billing: BillingRecord) {
    setPayingId(billing.id)
    await new Promise((resolve) => setTimeout(resolve, 800))
    alert(`模拟支付成功！${billing.month} 账单 ${formatCurrency(billing.total)} 已缴纳。`)
    setBillings((prev) =>
      prev.map((b) =>
        b.id === billing.id
          ? { ...b, status: 'PAID', paidAt: new Date().toISOString() }
          : b
      )
    )
    setPayingId(null)
  }

  const unpaidBillings = billings.filter((b) => b.status === 'UNPAID')
  const paidBillings = billings.filter((b) => b.status === 'PAID')
  const totalUnpaid = unpaidBillings.reduce((s, b) => s + b.total, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!elder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="text-gray-500">暂无关联家人信息，请联系机构管理员</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">费用缴纳</h1>
        <p className="text-sm text-gray-500 mt-1">{elder.name} 的账单明细与缴费记录</p>
      </div>

      {/* 待缴提示横幅 */}
      {unpaidBillings.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              您有 {unpaidBillings.length} 笔账单待缴纳，共计 {formatCurrency(totalUnpaid)}
            </p>
            <p className="text-xs text-red-600 mt-0.5">请尽快完成缴费，以确保护理服务正常进行</p>
          </div>
        </div>
      )}

      {/* 待缴账单 */}
      {unpaidBillings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">待缴账单</h2>
          {unpaidBillings.map((billing) => (
            <Card key={billing.id} className="border-red-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Receipt className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-gray-900">{billing.month} 账单</span>
                      <Badge variant="danger">未缴纳</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">床位费</span>
                        <span className="text-gray-900">{formatCurrency(billing.baseFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">护理费</span>
                        <span className="text-gray-900">{formatCurrency(billing.careFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">药品费</span>
                        <span className="text-gray-900">{formatCurrency(billing.medicineFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">其他费用</span>
                        <span className="text-gray-900">{formatCurrency(billing.otherFee)}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-red-100 pt-3">
                      <span className="text-sm font-bold text-gray-900">合计应缴</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(billing.total)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => handlePay(billing)}
                  disabled={payingId === billing.id}
                >
                  {payingId === billing.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      支付中...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-1" />
                      立即缴纳 {formatCurrency(billing.total)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 历史记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            缴费历史记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paidBillings.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400">
              <Receipt className="h-8 w-8 mb-2" />
              <p className="text-sm">暂无缴费记录</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left font-medium text-gray-500">账单月份</th>
                    <th className="pb-3 text-left font-medium text-gray-500">缴费金额</th>
                    <th className="pb-3 text-left font-medium text-gray-500">状态</th>
                    <th className="pb-3 text-left font-medium text-gray-500">缴费日期</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paidBillings.map((billing) => (
                    <tr key={billing.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{billing.month}</td>
                      <td className="py-3 text-gray-900">{formatCurrency(billing.total)}</td>
                      <td className="py-3">
                        <Badge variant="success">已缴纳</Badge>
                      </td>
                      <td className="py-3 text-gray-500">
                        {billing.paidAt
                          ? new Date(billing.paidAt).toLocaleDateString('zh-CN')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
