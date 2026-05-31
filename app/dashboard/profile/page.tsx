import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Shield, Building2 } from 'lucide-react'
import { ROLES } from '@/lib/utils'
import type { RoleKey } from '@/lib/utils'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const roleLabel = user?.role ? ROLES[user.role as RoleKey]?.label : '未知'

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">个人资料</h1>
        <p className="text-sm text-gray-500 mt-1">您的账号基本信息</p>
      </div>
      <Card>
        <CardHeader><CardTitle>账号信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: User, label: '姓名', value: user?.name },
            { icon: Mail, label: '邮箱', value: user?.email },
            { icon: Shield, label: '角色', value: roleLabel },
            { icon: Building2, label: '所属机构', value: user?.organizationName || '总部' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
