import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Building2, Plus, Search } from 'lucide-react'

interface OrganizationsPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function OrganizationsPage({ searchParams }: OrganizationsPageProps) {
  const { q } = await searchParams

  const organizations = await prisma.organization.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { code: { contains: q } },
            { address: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { elders: true, users: true },
      },
    },
  })

  const planLabels: Record<string, string> = {
    BASIC: '基础版',
    PRO: '专业版',
    ENTERPRISE: '企业版',
  }

  const statusVariant = (status: string): 'success' | 'danger' | 'warning' | 'secondary' => {
    if (status === 'ACTIVE') return 'success'
    if (status === 'INACTIVE') return 'danger'
    if (status === 'SUSPENDED') return 'warning'
    return 'secondary'
  }

  const statusLabel = (status: string): string => {
    if (status === 'ACTIVE') return '正常'
    if (status === 'INACTIVE') return '停用'
    if (status === 'SUSPENDED') return '暂停'
    return status
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">机构管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理平台上所有养老机构</p>
        </div>
        <Link href="/dashboard/admin/organizations/new" className="inline-flex items-center gap-2 bg-[#2E75B6] text-white hover:bg-[#1F497D] h-10 px-4 text-sm rounded-xl font-medium transition-colors">
          <Plus className="h-4 w-4" />
          新增机构
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <form method="GET" className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={q ?? ''}
                placeholder="搜索机构名称、编码或地址..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              搜索
            </Button>
            {q && (
              <Link href="/dashboard/admin/organizations" className="inline-flex items-center h-8 px-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">清除</Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            机构列表
            <span className="ml-auto text-sm font-normal text-gray-400">
              共 {organizations.length} 条
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{q ? '未找到匹配的机构' : '暂无机构数据'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">机构名称</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">编码</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">联系电话</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">地址</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">套餐</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">老人数</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">用户数</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">创建时间</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">{org.name}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">{org.code}</td>
                      <td className="py-3 px-4 text-gray-500">{org.phone || '—'}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                        {org.address || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          {planLabels[org.plan] ?? org.plan}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{org._count.elders}</td>
                      <td className="py-3 px-4 text-gray-700">{org._count.users}</td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(org.status)}>
                          {statusLabel(org.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(org.createdAt)}</td>
                      <td className="py-3 px-4">
                        <Link href={`/dashboard/admin/organizations/${org.id}`} className="inline-flex items-center h-8 px-3 text-sm text-[#2E75B6] hover:bg-blue-50 rounded-lg transition-colors">详情</Link>
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
