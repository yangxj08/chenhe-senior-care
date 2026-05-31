import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
        <p className="text-sm text-gray-500 mt-1">账号偏好与通知设置</p>
      </div>
      <Card>
        <CardHeader><CardTitle>通知设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Bell, label: '护理记录提醒', desc: '有新护理记录时通知我' },
            { icon: Shield, label: '安全提醒', desc: '异常登录时发送邮件提醒' },
            { icon: Globe, label: '系统公告', desc: '接收平台重要公告' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="text-xs text-gray-400 text-center">更多设置功能持续开发中</p>
    </div>
  )
}
