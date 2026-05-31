'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Elder {
  id: string
  name: string
  roomNumber: string | null
  careLevel: string
}

interface FormData {
  elderId: string
  type: string
  description: string
  temperature: string
  bloodPressure: string
  pulse: string
  mood: string
}

const initialForm: FormData = {
  elderId: '',
  type: '',
  description: '',
  temperature: '',
  bloodPressure: '',
  pulse: '',
  mood: '',
}

const CARE_TYPES = [
  { value: '日常护理', label: '日常护理' },
  { value: '用药管理', label: '用药管理' },
  { value: '康复训练', label: '康复训练' },
  { value: '膳食记录', label: '膳食记录' },
  { value: '异常上报', label: '异常上报' },
  { value: '体征检测', label: '体征检测' },
  { value: '心理疏导', label: '心理疏导' },
]

const MOOD_OPTIONS = [
  { value: '良好', label: '良好 😊' },
  { value: '平稳', label: '平稳 😐' },
  { value: '不适', label: '不适 😟' },
  { value: '需关注', label: '需关注 🔴' },
]

export default function NewCareRecordPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [elders, setElders] = useState<Elder[]>([])
  const [loadingElders, setLoadingElders] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/elders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setElders(data)
      })
      .catch(() => setError('加载老人列表失败'))
      .finally(() => setLoadingElders(false))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.elderId) { setError('请选择服务老人'); return }
    if (!form.type) { setError('请选择护理类型'); return }
    if (!form.description.trim()) { setError('请填写护理描述'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/care-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderId: form.elderId,
          type: form.type,
          description: form.description,
          temperature: form.temperature ? Number(form.temperature) : undefined,
          bloodPressure: form.bloodPressure || undefined,
          pulse: form.pulse ? Number(form.pulse) : undefined,
          mood: form.mood || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? '提交失败，请重试')
        return
      }

      router.push('/dashboard/org/care')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/org/care">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新增护理记录</h1>
          <p className="text-sm text-gray-500 mt-0.5">记录本次护理情况和生命体征</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Elder & Type */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                服务老人 <span className="text-red-500">*</span>
              </label>
              <Select
                name="elderId"
                value={form.elderId}
                onChange={handleChange}
                disabled={loadingElders}
              >
                <option value="">
                  {loadingElders ? '加载中...' : '请选择老人'}
                </option>
                {elders.map((elder) => (
                  <option key={elder.id} value={elder.id}>
                    {elder.name}
                    {elder.roomNumber ? ` · ${elder.roomNumber}室` : ''}
                    {` · ${elder.careLevel}级`}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                护理类型 <span className="text-red-500">*</span>
              </label>
              <Select name="type" value={form.type} onChange={handleChange}>
                <option value="">请选择护理类型</option>
                {CARE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                护理描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="详细描述本次护理情况..."
                rows={4}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vitals */}
        <Card>
          <CardHeader>
            <CardTitle>生命体征（选填）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">体温 (°C)</label>
                <Input
                  type="number"
                  name="temperature"
                  value={form.temperature}
                  onChange={handleChange}
                  placeholder="如：36.5"
                  step="0.1"
                  min={35}
                  max={42}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">血压 (mmHg)</label>
                <Input
                  name="bloodPressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  placeholder="如：120/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">脉搏 (次/分)</label>
                <Input
                  type="number"
                  name="pulse"
                  value={form.pulse}
                  onChange={handleChange}
                  placeholder="如：72"
                  min={30}
                  max={200}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">情绪状态</label>
                <Select name="mood" value={form.mood} onChange={handleChange}>
                  <option value="">请选择</option>
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Select>
              </div>
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
          <Link href="/dashboard/org/care">
            <Button variant="outline" type="button">取消</Button>
          </Link>
          <Button type="submit" disabled={loading || loadingElders}>
            {loading ? '提交中...' : '保存记录'}
          </Button>
        </div>
      </form>
    </div>
  )
}
