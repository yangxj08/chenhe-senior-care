'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewOrganizationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    plan: 'BASIC',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('请填写机构名称'); return }
    if (!form.code.trim()) { setError('请填写机构编码'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? '提交失败，请重试')
        return
      }
      router.push('/dashboard/admin/organizations')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin/organizations" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新增机构</h1>
          <p className="text-sm text-gray-500 mt-0.5">在平台中创建一家新的合作养老机构</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className="text-base">机构信息</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">机构名称 *</label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="如：郴和·桂阳颐养中心" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">机构编码 *</label>
                <Input name="code" value={form.code} onChange={handleChange} placeholder="如：GUIYANG-001" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">机构地址</label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="如：湖南省郴州市桂阳县" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">联系电话</label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="如：0735-xxxxxxx" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">套餐版本</label>
                <Select name="plan" value={form.plan} onChange={handleChange}>
                  <option value="BASIC">基础版</option>
                  <option value="PROFESSIONAL">专业版</option>
                  <option value="ENTERPRISE">企业版</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end mt-6">
          <Link href="/dashboard/admin/organizations">
            <Button type="button" variant="outline">取消</Button>
          </Link>
          <Button type="submit" disabled={loading}>{loading ? '创建中...' : '创建机构'}</Button>
        </div>
      </form>
    </div>
  )
}
