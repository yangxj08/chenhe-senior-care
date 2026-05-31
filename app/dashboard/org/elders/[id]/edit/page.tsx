'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface FormData {
  name: string
  gender: string
  age: string
  idCard: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  careLevel: string
  roomNumber: string
  bedNumber: string
  notes: string
  status: string
}

const initialForm: FormData = {
  name: '',
  gender: '',
  age: '',
  idCard: '',
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  careLevel: '',
  roomNumber: '',
  bedNumber: '',
  notes: '',
  status: 'ACTIVE',
}

export default function EditElderPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const detailHref = `/dashboard/org/elders/${id}`

  const [form, setForm] = useState<FormData>(initialForm)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setFetching(true)
      setError('')
      try {
        const res = await fetch(`/api/elders/${id}`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          if (!cancelled) setError(data.error ?? '加载失败，请重试')
          return
        }
        const elder = await res.json()
        if (cancelled) return
        setForm({
          name: elder.name ?? '',
          gender: elder.gender ?? '',
          age: elder.age != null ? String(elder.age) : '',
          idCard: elder.idCard ?? '',
          phone: elder.phone ?? '',
          emergencyContact: elder.emergencyContact ?? '',
          emergencyPhone: elder.emergencyPhone ?? '',
          careLevel: elder.careLevel ?? '',
          roomNumber: elder.roomNumber ?? '',
          bedNumber: elder.bedNumber ?? '',
          notes: elder.notes ?? '',
          status: elder.status ?? 'ACTIVE',
        })
      } catch {
        if (!cancelled) setError('网络错误，请重试')
      } finally {
        if (!cancelled) setFetching(false)
      }
    }

    if (id) load()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) { setError('请填写姓名'); return }
    if (!form.gender) { setError('请选择性别'); return }
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) <= 0) { setError('请填写有效年龄'); return }
    if (!form.emergencyContact.trim()) { setError('请填写紧急联系人'); return }
    if (!form.emergencyPhone.trim()) { setError('请填写紧急联系电话'); return }
    if (!form.careLevel) { setError('请选择护理等级'); return }

    setLoading(true)
    try {
      const res = await fetch(`/api/elders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? '保存失败，请重试')
        return
      }

      router.push(detailHref)
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href={detailHref}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑老人信息</h1>
            <p className="text-sm text-gray-500 mt-0.5">修改老人基本信息</p>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-20 text-sm text-gray-500">
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={detailHref}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">编辑老人信息</h1>
          <p className="text-sm text-gray-500 mt-0.5">修改老人基本信息</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="请输入老人姓名"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  性别 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 h-10 items-center">
                  {['男', '女'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  年龄 <span className="text-red-500">*</span>
                </label>
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">身份证号</label>
                <Input
                  name="idCard"
                  value={form.idCard}
                  onChange={handleChange}
                  placeholder="请输入身份证号"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>联系信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">本人手机号</label>
              <Input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="请输入手机号"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  紧急联系人 <span className="text-red-500">*</span>
                </label>
                <Input
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  placeholder="请输入紧急联系人姓名"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  紧急联系电话 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="emergencyPhone"
                  value={form.emergencyPhone}
                  onChange={handleChange}
                  placeholder="请输入紧急联系电话"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Info */}
        <Card>
          <CardHeader>
            <CardTitle>护理信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  护理等级 <span className="text-red-500">*</span>
                </label>
                <Select name="careLevel" value={form.careLevel} onChange={handleChange}>
                  <option value="">请选择护理等级</option>
                  <option value="A">A级 - 自理</option>
                  <option value="B">B级 - 半护理</option>
                  <option value="C">C级 - 全护理</option>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  状态 <span className="text-red-500">*</span>
                </label>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="ACTIVE">在住</option>
                  <option value="INACTIVE">离院</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">房间号</label>
                <Input
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="如：101"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">床位号</label>
                <Input
                  name="bedNumber"
                  value={form.bedNumber}
                  onChange={handleChange}
                  placeholder="如：A"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">备注</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="其他需要备注的信息..."
                rows={3}
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
          <Link href={detailHref}>
            <Button variant="outline" type="button">取消</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? '保存中...' : '保存修改'}
          </Button>
        </div>
      </form>
    </div>
  )
}
