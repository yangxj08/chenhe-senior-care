"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Trophy, Users, DollarSign, CheckCircle } from "lucide-react";

// ─────────────────────────────────────────────
// 数据
// ─────────────────────────────────────────────

const investmentHighlights = [
  {
    icon: TrendingUp,
    title: "高速增长市场",
    desc: "中国60岁以上老人已超3亿，养老缺口巨大。预计2030年市场规模突破10万亿，红利期长达20年以上。",
    stat: "10万亿",
    statLabel: "2030年市场规模",
  },
  {
    icon: Trophy,
    title: "成熟品牌体系",
    desc: "郴和养老拥有完整的标准化运营手册、SaaS管理系统、品牌营销素材，加盟即可快速复制成功模型。",
    stat: "6年+",
    statLabel: "品牌积淀",
  },
  {
    icon: Users,
    title: "全程扶持体系",
    desc: "从选址、装修、招聘、开业到持续运营，总部派驻督导全程陪跑，无养老行业经验同样可以成功运营。",
    stat: "100%",
    statLabel: "开业服务覆盖",
  },
  {
    icon: DollarSign,
    title: "清晰财务回报",
    desc: "经过验证的盈利模型，单店18-24个月回收初始投资，成熟期年营收360万元以上，财务回报透明可预期。",
    stat: "18-24月",
    statLabel: "投资回收期",
  },
];

const products = [
  {
    id: "product-a",
    name: "产品A",
    subtitle: "轻资产合伙人计划",
    minInvestment: "10万",
    highlight: "年化12-15%",
    color: "#2E75B6",
    bgGradient: "linear-gradient(135deg, #2E75B6, #3d8fd4)",
    tag: "门槛低",
    description:
      "适合希望参与养老产业但暂无条件直接运营机构的投资者。以资金合伙人方式参与郴和养老直营机构运营，享受稳定年化收益。",
    features: [
      "最低投资门槛：10万元",
      "年化综合收益：12%-15%",
      "投资期限：1年/2年/3年可选",
      "每季度分红一次",
      "资金安全有合同保障",
      "可参与实地考察",
      "享受优先购买高级产品权益",
    ],
    suitable: "理财型投资者 / 个人 / 家庭",
  },
  {
    id: "product-b",
    name: "产品B",
    subtitle: "战略加盟运营计划",
    minInvestment: "100万",
    highlight: "IRR 28%",
    color: "#E8A838",
    bgGradient: "linear-gradient(135deg, #E8A838, #f0b84a)",
    tag: "回报高",
    description:
      "以品牌加盟方式独立运营郴和养老连锁机构，总部提供完整运营支持。适合有场地资源或资金实力的战略合作伙伴，享受品牌溢价与经营主动权。",
    features: [
      "最低投资规模：100万元",
      "内部收益率（IRR）：28%",
      "18-24个月回收初始投资",
      "机构运营主体由加盟商控制",
      "5年独家区域保护（地级市级别）",
      "全套SaaS系统免费使用",
      "总部派驻督导团队常驻6个月",
      "享受总部集采价节省成本20%+",
    ],
    suitable: "有场地资源者 / 企业投资者 / 医疗机构",
  },
];

const financialTable = [
  { item: "初始投资（装修+设备+运营资金）", productA: "10万起", productB: "100-300万" },
  { item: "预期年化收益 / IRR", productA: "12%-15%", productB: "28%" },
  { item: "投资回收期", productA: "合同到期还本", productB: "18-24个月" },
  { item: "单店年营收（成熟期50床）", productA: "按份额分配", productB: "360万+" },
  { item: "净利润率（成熟期）", productA: "按合同比例", productB: "约25%-30%" },
  { item: "月均每床收入", productA: "不适用", productB: "约6,000元" },
  { item: "运营成本占比", productA: "不适用", productB: "约70%-75%" },
  { item: "品牌溢价（vs 行业均值）", productA: "享受", productB: "+30%" },
];

const franchiseSteps = [
  {
    step: "01",
    title: "提交申请",
    desc: "填写本页面底部申请表，或拨打招商热线400-888-0001，留下基本信息与投资意向。",
    duration: "即时",
  },
  {
    step: "02",
    title: "资质审核",
    desc: "招商顾问24小时内回访，核查申请人资金实力、场地情况、从业背景，完成初步评估。",
    duration: "1-3天",
  },
  {
    step: "03",
    title: "实地考察",
    desc: "安排参观郴和养老旗舰直营机构，与运营团队深入交流，了解真实运营情况与盈利数据。",
    duration: "1天",
  },
  {
    step: "04",
    title: "签约筹建",
    desc: "双方确认合作方案，签署加盟协议，总部启动选址指导、装修方案设计与系统培训。",
    duration: "2-4周",
  },
  {
    step: "05",
    title: "开业运营",
    desc: "总部督导团队现场驻场，协助开业推广、人员招聘，确保首月入住率达标，之后持续运营支持。",
    duration: "长期",
  },
];

const faqs = [
  {
    q: "没有养老行业经验，可以加盟吗？",
    a: "完全可以。郴和养老提供完整的「无经验启动包」：系统化培训课程、标准化操作手册、SaaS管理系统，加上总部督导团队现场驻场6个月，确保没有行业经验的加盟商也能成功运营。",
  },
  {
    q: "投资所需场地怎么找？",
    a: "加盟商可自备场地，也可由总部协助选址。我们有专业选址评估模型，对建筑面积、周边老龄人口密度、竞争环境等关键指标逐一评估，确保选址具备盈利基础，减少投资风险。",
  },
  {
    q: "产品A（10万）的资金安全如何保障？",
    a: "产品A投资合同由律师见证，资金进入郴和养老科技有限公司专项账户，用于直营机构运营，每季度出具经第三方审计的财务报告，收益按合同约定时间足额支付。",
  },
  {
    q: "加盟区域是否有保护政策？",
    a: "产品B战略加盟享受地级市级别5年独家区域保护，在协议期内总部不在相同区域内批准同类加盟机构，充分保护加盟商利益。",
  },
  {
    q: "如果运营遇到困难，总部会提供哪些支持？",
    a: "郴和养老提供全生命周期运营支持：开业期督导驻场、定期运营诊断（每季度一次）、总部营销资源共享、节假日联合招募活动、年度加盟商大会经验交流，确保加盟商不孤立作战。",
  },
];

// ─────────────────────────────────────────────
// 申请表单
// ─────────────────────────────────────────────

function ApplyForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    investment: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 模拟提交延迟
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">申请已提交！</h3>
        <p className="text-gray-500">
          我们的招商顾问将在24小时内与您联系，请保持电话畅通。
        </p>
        <p className="text-gray-400 text-sm mt-2">
          如有紧急需求，请直接拨打：
          <span className="font-bold" style={{ color: "#2E75B6" }}>
            400-888-0001
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            您的姓名 <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="请输入真实姓名"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            联系电话 <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="请输入手机号码"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          意向城市 <span className="text-red-500">*</span>
        </label>
        <input
          name="city"
          type="text"
          required
          value={form.city}
          onChange={handleChange}
          placeholder="请输入您期望合作的城市"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          投资意向 <span className="text-red-500">*</span>
        </label>
        <select
          name="investment"
          required
          value={form.investment}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors bg-white"
        >
          <option value="" disabled>
            请选择投资意向
          </option>
          <option value="product-a-10">产品A — 10万合伙人（年化12-15%）</option>
          <option value="product-a-50">产品A — 50万合伙人（年化13-15%）</option>
          <option value="product-b-100">产品B — 100万战略加盟（IRR 28%）</option>
          <option value="product-b-200">产品B — 200万+战略加盟（IRR 28%）</option>
          <option value="other">其他 / 暂未确定</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          补充说明（选填）
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="如您有场地资源、医疗背景或其他特殊情况，欢迎简要说明"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
        style={{ backgroundColor: "#E8A838" }}
      >
        {loading ? "提交中..." : "立即提交申请"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        提交即表示您同意我们的隐私政策。您的信息仅用于招商联系，不会泄露给第三方。
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// 页面
// ─────────────────────────────────────────────

export default function FranchisePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section
        className="relative py-24 lg:py-32 text-center text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2e45 0%, #2E75B6 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3" style={{ backgroundColor: "#E8A838" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3" style={{ backgroundColor: "#E8A838" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(232,168,56,0.2)", color: "#E8A838" }}
          >
            加盟合作
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            加入郴和养老，
            <br />
            <span style={{ color: "#E8A838" }}>共享银发经济红利</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            两种灵活合作模式，10万元起可参与，最高IRR达28%。
            经过验证的盈利模型，全程扶持体系，帮您稳健布局中国最确定的长期赛道。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:shadow-xl"
              style={{ backgroundColor: "#E8A838" }}
            >
              立即申请名额
            </a>
            <a
              href="#products"
              className="px-8 py-4 rounded-xl font-bold text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            >
              查看合作方案
            </a>
          </div>
        </div>
      </section>

      {/* ── 4个投资亮点 ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              为什么选择郴和养老
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              4大投资亮点
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentHighlights.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <item.icon className="w-10 h-10 text-[#2E75B6]" />
                </div>
                <div
                  className="text-2xl font-bold mb-0.5"
                  style={{ color: "#2E75B6" }}
                >
                  {item.stat}
                </div>
                <div
                  className="text-xs mb-3"
                  style={{ color: "#E8A838" }}
                >
                  {item.statLabel}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 两种产品 ── */}
      <section className="py-20 bg-white" id="products">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              合作方案
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              两种合作模式，灵活选择
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              无论您是理财型投资者还是希望深度参与运营的战略伙伴，我们都有适合您的方案。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                id={product.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* 产品头部 */}
                <div
                  className="p-8 text-white"
                  style={{ background: product.bgGradient }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span
                        className="inline-block text-xs font-bold px-2 py-1 rounded-full mb-2"
                        style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                      >
                        {product.tag}
                      </span>
                      <h3 className="text-3xl font-bold">{product.name}</h3>
                      <p className="text-white/80 mt-1">{product.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{product.highlight}</div>
                      <div className="text-white/70 text-sm">核心回报指标</div>
                    </div>
                  </div>
                  <div
                    className="inline-block text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    最低投资：{product.minInvestment}
                  </div>
                </div>

                {/* 产品详情 */}
                <div className="bg-white p-8">
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {product.description}
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <span
                          className="font-bold flex-shrink-0 mt-0.5"
                          style={{ color: product.color }}
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="text-xs font-medium px-3 py-2 rounded-lg mb-6"
                    style={{
                      backgroundColor: product.color === "#E8A838" ? "#fffbf0" : "#f0f6ff",
                      color: product.color,
                    }}
                  >
                    适合人群：{product.suitable}
                  </div>
                  <a
                    href="#apply"
                    className="block w-full text-center py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: product.color }}
                  >
                    申请此方案
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 财务回报表格 ── */}
      <section
        className="py-20"
        style={{ backgroundColor: "#1a2e45" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              财务数据
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              清晰透明的回报模型
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <th className="text-left px-6 py-4 text-gray-300 font-semibold">
                    财务指标
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-center"
                    style={{ color: "#93c5fd" }}
                  >
                    产品A（合伙人）
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-center"
                    style={{ color: "#E8A838" }}
                  >
                    产品B（加盟运营）
                  </th>
                </tr>
              </thead>
              <tbody>
                {financialTable.map((row, i) => (
                  <tr
                    key={row.item}
                    style={{
                      backgroundColor:
                        i % 2 === 0
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <td className="px-6 py-4 text-gray-300">{row.item}</td>
                    <td
                      className="px-6 py-4 text-center font-medium"
                      style={{ color: "#93c5fd" }}
                    >
                      {row.productA}
                    </td>
                    <td
                      className="px-6 py-4 text-center font-medium"
                      style={{ color: "#E8A838" }}
                    >
                      {row.productB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            * 以上数据基于成熟期运营机构实际数据测算，具体回报受市场、地区、运营情况等因素影响，详细财务测算请联系招商顾问。
          </p>
        </div>
      </section>

      {/* ── 5步加盟流程 ── */}
      <section className="py-20 bg-gray-50" id="process">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              加盟流程
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              5步，从申请到开业
            </h2>
          </div>

          <div className="space-y-6">
            {franchiseSteps.map((step, i) => (
              <div
                key={step.step}
                className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{
                    backgroundColor: i === franchiseSteps.length - 1 ? "#E8A838" : "#2E75B6",
                  }}
                >
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#f0f6ff", color: "#2E75B6" }}
                    >
                      约{step.duration}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              常见问题
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              加盟前您最关心的问题
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <div
                  className="p-6 flex items-start gap-4"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#2E75B6" }}
                  >
                    Q
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-3">{faq.q}</p>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#E8A838" }}
                      >
                        A
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 申请表单 ── */}
      <section
        className="py-20"
        id="apply"
        style={{ backgroundColor: "#f0f6ff" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              立即行动
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
              申请加盟名额
            </h2>
            <p className="text-gray-500">
              填写申请表，招商顾问将在24小时内联系您，为您提供专属合作方案。
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md">
            <ApplyForm />
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            或直接拨打招商热线：
            <a
              href="tel:4008880001"
              className="font-bold ml-1"
              style={{ color: "#2E75B6" }}
            >
              400-888-0001
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
