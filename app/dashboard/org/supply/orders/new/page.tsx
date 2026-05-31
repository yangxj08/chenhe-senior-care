'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Supplier {
  id: string
  name: string
  category: string
}

interface Item {
  itemName: string
  unit: string
  quantity: string
  unitPrice: string
}

const emptyItem: Item = { itemName: '', unit: '', quantity: '', unitPrice: '' }

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierId, setSupplierId] = useState('')
  const [expectedDate, setExpectedDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Item[]>([{ ...emptyItem }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/suppliers')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSuppliers(data) })
      .catch(() => setError('加载供应商列表失败'))
  }, [])

  const updateItem = (i: number, field: keyof Item, value: string) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)))
  }
  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }])
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i))

  const total = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!supplierId) { setError('请选择供应商'); return }
    const validItems = items.filter((it) => it.itemName.trim() && Number(it.quantity) > 0)
    if (validItems.length === 0) { setError('请至少填写一项有效采购明细'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, expectedDate, notes, items: validItems }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? '提交失败，请重试')
        return
      }
      router.push('/dashboard/org/supply/orders')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/org/supply/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新增采购订单</h1>
          <p className="text-sm text-gray-500 mt-0.5">创建一笔向供应商的采购订单</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">订单信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">供应商 *</label>
              <Select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                <option value="">请选择供应商</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">预计到货日期</label>
                <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">备注</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="可选" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">采购明细</CardTitle>
            <button type="button" onClick={addItem} className="text-sm text-[#2E75B6] hover:underline flex items-center gap-1">
              <Plus className="h-4 w-4" />添加一项
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  {i === 0 && <label className="block text-xs text-gray-500 mb-1">品名</label>}
                  <Input value={it.itemName} onChange={(e) => updateItem(i, 'itemName', e.target.value)} placeholder="如：大米" />
                </div>
                <div className="col-span-2">
                  {i === 0 && <label className="block text-xs text-gray-500 mb-1">单位</label>}
                  <Input value={it.unit} onChange={(e) => updateItem(i, 'unit', e.target.value)} placeholder="公斤" />
                </div>
                <div className="col-span-2">
                  {i === 0 && <label className="block text-xs text-gray-500 mb-1">数量</label>}
                  <Input type="number" value={it.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="0" />
                </div>
                <div className="col-span-3">
                  {i === 0 && <label className="block text-xs text-gray-500 mb-1">单价(元)</label>}
                  <Input type="number" value={it.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', e.target.value)} placeholder="0.00" />
                </div>
                <div className="col-span-1 flex justify-center pb-2">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">订单总额：<span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/dashboard/org/supply/orders">
            <Button type="button" variant="outline">取消</Button>
          </Link>
          <Button type="submit" disabled={loading}>{loading ? '提交中...' : '创建采购单'}</Button>
        </div>
      </form>
    </div>
  )
}
