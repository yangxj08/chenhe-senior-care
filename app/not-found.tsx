import Link from 'next/link'
import { Heart, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-[#2E75B6] rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1F497D]">郴和养老</span>
        </div>

        <div className="text-7xl font-bold text-[#2E75B6] mb-3">404</div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">页面不存在</h1>
        <p className="text-gray-500 text-sm mb-8">
          抱歉，您访问的页面可能已被移动或删除。请检查网址是否正确，或返回首页继续浏览。
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2E75B6] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1F497D] transition-colors"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            进入控制台
          </Link>
        </div>
      </div>
    </div>
  )
}
