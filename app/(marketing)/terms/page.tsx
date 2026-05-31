import { FileText } from 'lucide-react'

export const metadata = {
  title: '服务条款 - 郴和养老',
  description: '郴和养老服务条款',
}

const SECTIONS = [
  {
    title: '一、服务内容',
    body: '郴和养老为入住老人提供生活照料、护理服务、康复训练、医养结合、餐饮服务等综合养老服务，并通过数字化平台为家属、投资人、加盟机构提供信息查询与管理服务。具体服务内容以双方签订的入住服务合同或合作协议为准。',
  },
  {
    title: '二、用户账号',
    body: '您应妥善保管账号及密码，对账号下的所有操作承担责任。如发现账号被盗用或存在安全隐患，应立即通知我们。我们有权对违规使用账号的行为采取限制、暂停或终止服务等措施。',
  },
  {
    title: '三、入住与护理服务',
    body: '入住老人需经过能力评估确定护理等级（A自理/B半护理/C全护理）。我们将依据评估结果提供相应等级的护理服务。家属应如实提供老人健康状况，配合机构做好护理风险告知与签字确认。',
  },
  {
    title: '四、费用与缴纳',
    body: '服务费用按护理等级及附加服务项目计费，账单按月生成。家属应在约定期限内完成缴费。逾期未缴费的，我们将通过平台和电话进行提醒，长期欠费可能影响服务的正常提供。',
  },
  {
    title: '五、加盟与投资',
    body: '加盟合作及带资入股相关事宜，以双方另行签订的《加盟合作协议》《投资协议》为准。投资收益存在市场风险，过往业绩不代表未来表现。我们严格遵守国家关于合格投资者的相关法律法规。',
  },
  {
    title: '六、责任限制',
    body: '我们将尽合理努力提供安全、专业的养老服务。对于因不可抗力、老人自身疾病发展、或家属未如实告知健康状况导致的损害，我们在法律允许范围内不承担相应责任。具体责任划分以入住服务合同为准。',
  },
  {
    title: '七、服务变更与终止',
    body: '我们有权根据运营需要调整服务内容并提前通知。您可依据合同约定申请终止服务并办理退住手续。任一方严重违反合同约定的，另一方有权解除合同。',
  },
  {
    title: '八、争议解决',
    body: '本条款的解释及争议解决均适用中华人民共和国法律。因使用本服务产生的争议，双方应友好协商解决；协商不成的，可向机构所在地有管辖权的人民法院提起诉讼。',
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-[#2E75B6]/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#2E75B6]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">服务条款</h1>
      </div>
      <p className="text-sm text-gray-400 mb-10">最近更新日期：2026年5月31日</p>

      <div className="space-y-8">
        <p className="text-gray-600 leading-relaxed">
          欢迎使用郴和养老服务。本服务条款是您与郴和养老之间就使用本平台及相关养老服务达成的协议。使用我们的服务即表示您已阅读、理解并同意接受本条款的全部内容。
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
          如对本服务条款有任何疑问，请联系我们：电话 0735-7222005 ｜ 邮箱 info@chenhe.com ｜ 地址 湖南省郴州市嘉禾县
        </p>
      </div>
    </div>
  )
}
