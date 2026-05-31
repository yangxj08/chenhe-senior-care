import { Shield } from 'lucide-react'

export const metadata = {
  title: '隐私政策 - 郴和养老',
  description: '郴和养老隐私政策',
}

const SECTIONS = [
  {
    title: '一、信息收集',
    body: '我们在您使用郴和养老服务过程中，可能收集以下信息：注册信息（姓名、手机号、邮箱）、入住老人的健康档案与护理记录、缴费记录、以及为提供医养结合服务所必需的医疗相关信息。我们仅收集为实现服务目的所必要的最少信息。',
  },
  {
    title: '二、信息使用',
    body: '我们使用收集的信息用于：为入住老人提供护理与健康管理服务、向家属推送老人状态与账单信息、改进服务质量、以及履行法律法规规定的义务。未经您的明确同意，我们不会将信息用于上述目的之外的用途。',
  },
  {
    title: '三、信息保护',
    body: '我们采用符合国家网络安全等级保护要求的技术措施保护您的信息，包括数据加密存储、访问权限控制、操作日志审计等。老人健康数据按照字段级加密存储，仅授权人员可在权限范围内访问。',
  },
  {
    title: '四、信息共享',
    body: '我们不会向第三方出售您的个人信息。仅在以下情况下共享信息：经您明确同意、为提供医疗急救服务向合作医院共享必要信息、或依据法律法规及政府主管部门的要求。',
  },
  {
    title: '五、您的权利',
    body: '您有权查询、更正、删除您的个人信息，并可撤回此前作出的授权同意。如需行使上述权利，请联系机构管理员或拨打客服电话 0735-7222005。',
  },
  {
    title: '六、未成年人与特殊群体保护',
    body: '本平台服务对象主要为老年人。对于失能、失智等特殊群体，我们会在其法定监护人或授权家属的同意下处理相关信息，并采取额外的保护措施。',
  },
  {
    title: '七、政策更新',
    body: '我们可能适时更新本隐私政策。政策更新后将在本页面公布，重大变更将通过平台通知或短信告知。继续使用服务即表示您接受更新后的政策。',
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-[#2E75B6]/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#2E75B6]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">隐私政策</h1>
      </div>
      <p className="text-sm text-gray-400 mb-10">最近更新日期：2026年5月31日</p>

      <div className="prose prose-sm max-w-none space-y-8">
        <p className="text-gray-600 leading-relaxed">
          郴和养老（以下简称"我们"）非常重视用户的隐私和个人信息保护。本隐私政策说明我们如何收集、使用、存储和保护您的信息。请您在使用我们的服务前仔细阅读并理解本政策。
        </p>
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 p-5 rounded-2xl bg-gray-50 border border-gray-100">
        <p className="text-sm text-gray-500">
          如对本隐私政策有任何疑问，请联系我们：电话 0735-7222005 ｜ 邮箱 info@chenhe.com ｜ 地址 湖南省郴州市嘉禾县
        </p>
      </div>
    </div>
  )
}
