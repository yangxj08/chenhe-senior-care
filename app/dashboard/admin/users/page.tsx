import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ROLES } from '@/lib/utils'
import type { RoleKey } from '@/lib/utils'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { organization: true },
    orderBy: { createdAt: 'desc' },
  })

  const roleVariant = (role: string): 'danger' | 'warning' | 'info' | 'success' | 'secondary' | 'default' => {
    if (role === 'SUPER_ADMIN') return 'danger'
    if (role === 'ORG_ADMIN') return 'warning'
    if (role === 'NURSE') return 'info'
    if (role === 'FAMILY') return 'success'
    if (role === 'INVESTOR') return 'default'
    return 'secondary'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <p className="text-sm text-gray-500 mt-1">查看平台所有注册用户</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            用户列表
            <span className="ml-auto text-sm font-normal text-gray-400">
              共 {users.length} 位用户
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">暂无用户数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">姓名</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">邮箱</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">联系电话</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">角色</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">所属机构</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">注册时间</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-500">{user.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={roleVariant(user.role)}>
                          {ROLES[user.role as RoleKey]?.label ?? user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {user.organization ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            {user.organization.name}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(user.createdAt)}</td>
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
