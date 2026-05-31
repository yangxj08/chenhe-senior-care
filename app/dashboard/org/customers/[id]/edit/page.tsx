'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface FormData {
  name: string
  phone: string
  email: string
  gender: string
  age: string
  source: string
  status: string
  elderName: string
  elderAge: string
  careNeed: string
  budget: string
  visitDate: string
  followUpDate: string
  assignedTo: string
  notes: string
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  age: '',
  source: '',
  status: 'LEAD',
  elderName: '',
  elderAge: '',
  careNeed: '',
  budget: '',
  visitDate: '',
  followUpDate: '',
  assignedTo: '',
  notes: '',
}

// 把 ISO 日期/Date 转成 input[type=date] 需要的 YYYY-MM-DD
function toDateInput(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const id = params.id

  const [form, setForm] = useState<FormData>(initialForm)
  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const followUpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoadingData(true)
      setError('')
      try {
        const res = await fetch(`/api/customers/${id}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          if (active) setError(data.error ?? '加载客户信息失败')
          return
        }
        const c = await res.json()
        if (!active) return
        setForm({
          name: c.name ?? '',
          phone: c.phone ?? '',
          email: c.email ?? '',
          gender: c.gender ?? '',
          age: c.age != null ? String(c.age) : '',
          source: c.source ?? '',
          status: c.status ?? 'LEAD',
          elderName: c.elderName ?? '',
          elderAge: c.elderAge != null ? String(c.elderAge) : '',
          careNeed: c.careNeed ?? '',
          budget: c.budget ?? '',
          visitDate: toDateInput(c.visitDate),
          followUpDate: toDateInput(c.followUpDate),
          assignedTo: c.assignedTo ?? '',
          notes: c.notes ?? '',
        })
      } catch {
        if (active) setError('网络错误，请重试')
      } finally {
        if (active) setLoadingData(false)
      }
    }
    if (id) load()
    return () => {
      active = false
    }
  }, [id])

  // ?focus=followup 时自动聚焦下次跟进日期
  useEffect(() => {
    if (!loadingData && searchParams.get('focus') === 'followup') {
      followUpRef.current?.focus()
      followUpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loadingData, searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('请填写客户姓名')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          gender: form.gender,
          age: form.age,
          source: form.source,
          status: form.status,
          elderName: form.elderName.trim(),
          elderAge: form.elderAge,
          careNeed: form.careNeed,
          budget: form.budget.trim(),
          visitDate: form.visitDate,
          followUpDate: form.followUpDate,
          assignedTo: form.assignedTo.trim(),
          notes: form.notes.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? '保存失败，请重试')
        return
      }

      router.push('/dashboard/org/customers')
      router.refresh()
    } catch {
      setError('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/org/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">编辑客户</h1>
          <p className="text-sm text-gray-500 mt-0.5">更新客户资料与跟进信息</p>
        </div>
      </div>

      {loadingData ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-400">加载中...</CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 客户信息 */}
          <Card>
            <CardHeader>
              <CardTitle>客户信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    客户姓名 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="请输入客户姓名"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">联系电话</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="请输入联系电话"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">邮箱</label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="请输入邮箱"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">性别</label>
                  <Select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">请选择</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">年龄</label>
                  <Input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="请输入年龄"
                    min={1}
                    max={150}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">来源渠道</label>
                  <Select name="source" value={form.source} onChange={handleChange}>
                    <option value="">请选择来源渠道</option>
                    <option value="REFERRAL">老客户介绍</option>
                    <option value="WALK_IN">自然来访</option>
                    <option value="ONLINE">线上咨询</option>
                    <option value="HOSPITAL">医院转介</option>
                    <option value="GOV">政府转介</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">客户状态</label>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="LEAD">线索</option>
                  <option value="VISITING">参观中</option>
                  <option value="NEGOTIATING">谈判中</option>
                  <option value="SIGNED">已签约</option>
                  <option value="LOST">已失单</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 意向老人 */}
          <Card>
            <CardHeader>
              <CardTitle>意向老人</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    意向老人姓名
                  </label>
                  <Input
                    name="elderName"
                    value={form.elderName}
                    onChange={handleChange}
                    placeholder="请输入意向老人姓名"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    意向老人年龄
                  </label>
                  <Input
                    type="number"
                    name="elderAge"
                    value={form.elderAge}
                    onChange={handleChange}
                    placeholder="请输入年龄"
                    min={1}
                    max={150}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">护理需求</label>
                  <Select name="careNeed" value={form.careNeed} onChange={handleChange}>
                    <option value="">请选择护理需求</option>
                    <option value="A">A级 - 自理</option>
                    <option value="B">B级 - 半自理</option>
                    <option value="C">C级 - 不自理</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">预算区间</label>
                  <Input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="如：4000-6000元/月"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 跟进信息 */}
          <Card>
            <CardHeader>
              <CardTitle>跟进信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">参观日期</label>
                  <Input
                    type="date"
                    name="visitDate"
                    value={form.visitDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    下次跟进日期
                  </label>
                  <Input
                    ref={followUpRef}
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">跟进人</label>
                <Input
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  placeholder="请输入跟进人员姓名"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">备注</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="跟进记录、客户意向等..."
                  rows={4}
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link href="/dashboard/org/customers">
              <Button variant="outline" type="button">
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? '保存中...' : '保存修改'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
