import Link from "next/link";
import { Stethoscope, Users, Home, Smartphone } from "lucide-react";

// ─────────────────────────────────────────────
// 数据常量
// ─────────────────────────────────────────────

const stats = [
  { value: "500+", label: "在住床位", sublabel: "覆盖多城市机构" },
  { value: "98%", label: "客户满意度", sublabel: "连续三年达标" },
  { value: "24h", label: "全天值守", sublabel: "专业护理团队" },
  { value: "10+", label: "布局城市", sublabel: "持续快速扩张" },
];

const serviceCards = [
  {
    tier: "A级",
    name: "基础养老",
    price: "3,500",
    unit: "元/月起",
    color: "#2E75B6",
    features: [
      "标准单人间（20㎡）",
      "三餐营养配餐",
      "基础生活护理",
      "日常健康监测",
      "文娱活动参与",
      "24小时安全值守",
    ],
    cta: "了解详情",
    highlight: false,
  },
  {
    tier: "B级",
    name: "标准养老",
    price: "4,500",
    unit: "元/月起",
    color: "#E8A838",
    features: [
      "舒适套间（35㎡）",
      "个性化营养餐饮",
      "一对一生活护理",
      "专属健康档案",
      "中西医定期体检",
      "家属实时探视",
      "康复训练课程",
    ],
    cta: "最受欢迎",
    highlight: true,
  },
  {
    tier: "C级",
    name: "高端养老",
    price: "5,800",
    unit: "元/月起",
    color: "#1a2e45",
    features: [
      "豪华套房（55㎡+）",
      "私人营养师定制餐",
      "专属护理管家",
      "全科医生驻场",
      "心理疏导服务",
      "VIP家属接待厅",
      "出行陪同服务",
      "紧急救护绿通",
    ],
    cta: "预约参观",
    highlight: false,
  },
];

const advantages = [
  {
    icon: Stethoscope,
    title: "医疗专业保障",
    desc: "与三甲医院深度合作，全科医生驻场，实现医疗与养老无缝衔接，紧急情况30分钟绿色通道。",
  },
  {
    icon: Users,
    title: "专业护理团队",
    desc: "所有护理人员持证上岗，定期专业培训，提供生活照料、康复护理、心理关怀全方位服务。",
  },
  {
    icon: Home,
    title: "家庭式环境",
    desc: "精心设计的居住空间，园林式户外活动区，营造温馨如家的生活氛围，让长辈安心舒适。",
  },
  {
    icon: Smartphone,
    title: "智慧养老科技",
    desc: "IoT健康监测设备全覆盖，家属APP实时查看长辈动态，数字化管理提升服务品质与安全性。",
  },
];

const investmentHighlights = [
  { label: "初始投资回收期", value: "18-24个月", note: "行业平均36个月" },
  { label: "年化综合回报", value: "12%-28%", note: "视投资档位而定" },
  { label: "单店年营收（成熟期）", value: "360万+", note: "50床满员运营" },
  { label: "品牌溢价", value: "30%", note: "高于同类机构收费" },
];

const franchiseSteps = [
  { step: "01", title: "提交申请", desc: "填写加盟申请表，留下联系方式，招商顾问24小时内回访。" },
  { step: "02", title: "资质审核", desc: "核查申请人背景、资金实力、场地条件，完成初步评估。" },
  { step: "03", title: "考察签约", desc: "实地参观样板店，双方深入洽谈，确认合作意向后签署协议。" },
  { step: "04", title: "筹建培训", desc: "总部提供选址、装修、设备采购全程指导及系统运营培训。" },
  { step: "05", title: "开业运营", desc: "总部派驻督导团队协助开业，持续提供运营、营销、管理支持。" },
];

const testimonials = [
  {
    name: "王女士",
    role: "北京加盟商",
    avatar: "王",
    content:
      "加盟郴和养老是我这几年最正确的决定。总部支持体系非常完善，从选址到开业全程陪跑，第14个月就实现了盈亏平衡，现在运营第2家了。",
    rating: 5,
  },
  {
    name: "李先生",
    role: "长沙加盟商",
    avatar: "李",
    content:
      "父母在郴和养老住了两年多，医疗保障和护理水平真的让家人放心。尤其是智慧养老APP，每天都能看到老人的状态，太贴心了。",
    rating: 5,
  },
  {
    name: "张总",
    role: "武汉投资人",
    avatar: "张",
    content:
      "作为财务投资人，看中的是郴和养老清晰的盈利模型和扎实的品牌积累。B产品年化28%的IRR完全符合预期，期待扩大合作规模。",
    rating: 5,
  },
];

// ─────────────────────────────────────────────
// 页面组件
// ─────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero 区域 ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2e45 0%, #2E75B6 60%, #3d8fd4 100%)",
        }}
      >
        {/* 背景装饰圆 */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: "#E8A838" }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 -translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: "#E8A838" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/30"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#E8A838" }}
            />
            中国专业医养结合养老品牌
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            让每一位长辈
            <br />
            <span style={{ color: "#E8A838" }}>安享温暖晚年</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            郴和养老以医养结合为核心，智慧科技为支撑，
            <br className="hidden sm:block" />
            为长辈提供专业、温馨、安全的全方位养老解决方案。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: "#E8A838" }}
            >
              了解服务方案
            </Link>
            <Link
              href="/franchise"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white rounded-xl border-2 border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              申请加盟合作 →
            </Link>
          </div>

          {/* 信任标签 */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            {["民政部备案机构", "AAA级信用评级", "国家医养结合试点", "ISO9001认证"].map(
              (tag) => (
                <span key={tag} className="flex items-center gap-1">
                  <span style={{ color: "#E8A838" }}>✓</span> {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── 统计数字 ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-4xl lg:text-5xl font-bold mb-1"
                  style={{ color: "#2E75B6" }}
                >
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-gray-800 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 三档服务卡片 ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              服务方案
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              三档专业养老服务
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              根据长辈需求与家庭预算，提供灵活多样的养老服务套餐，每一档均包含医养结合核心保障。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {serviceCards.map((card) => (
              <div
                key={card.tier}
                className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  card.highlight
                    ? "shadow-2xl ring-2"
                    : "shadow-md hover:shadow-xl"
                }`}
                style={card.highlight ? { ringColor: card.color } : {}}
              >
                {card.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: card.color }}
                  >
                    最受欢迎
                  </div>
                )}
                <div
                  className={`p-6 ${card.highlight ? "pt-10" : ""}`}
                  style={{ borderTop: `4px solid ${card.color}` }}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.tier}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {card.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: card.color }}
                    >
                      ¥{card.price}
                    </span>
                    <span className="text-gray-500 text-sm">{card.unit}</span>
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span style={{ color: card.color }} className="font-bold flex-shrink-0">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/services"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
                    style={
                      card.highlight
                        ? { backgroundColor: card.color, color: "white" }
                        : {
                            backgroundColor: "transparent",
                            color: card.color,
                            border: `2px solid ${card.color}`,
                          }
                    }
                  >
                    {card.cta === "最受欢迎" ? "立即咨询" : card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 医养结合四大优势 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              核心优势
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              医养结合，专业保障
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              将专业医疗与温馨养老深度融合，让长辈住得放心，家人更安心。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  className="p-6 rounded-2xl border border-gray-100 hover:border-[#2E75B6] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2E75B6] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2E75B6] transition-colors"
                  >
                    {adv.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 投资亮点区（深蓝背景） ── */}
      <section
        className="py-20"
        style={{ backgroundColor: "#1a2e45" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              投资机遇
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
              把握银发经济红利
            </h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              中国养老市场规模将于2030年突破10万亿，郴和养老帮您率先布局，共享行业红利。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {investmentHighlights.map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#E8A838" }}
                >
                  {item.value}
                </div>
                <div className="text-white font-semibold text-sm mb-1">
                  {item.label}
                </div>
                <div className="text-blue-300 text-xs">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/franchise"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: "#E8A838" }}
            >
              查看完整投资方案 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5步加盟流程时间线 ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              加盟流程
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              5步轻松开启养老事业
            </h2>
          </div>

          <div className="relative">
            {/* 连接线（桌面端） */}
            <div
              className="hidden lg:block absolute top-8 left-8 right-8 h-0.5"
              style={{ backgroundColor: "#E8E8E8" }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {franchiseSteps.map((step, i) => (
                <div key={step.step} className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                  <div
                    className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: "#2E75B6" }}
                  >
                    {step.step}
                  </div>
                  <div className="lg:mt-4">
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 客户评价 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              口碑见证
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              他们的真实评价
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: "#E8A838" }}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: "#2E75B6" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t.name}
                    </div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 底部 CTA 区域 ── */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #2E75B6 0%, #1a2e45 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            立即开启您的养老事业
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            限量开放城市合作名额，抢先布局，共享银发经济红利。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/franchise#apply"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-200 hover:opacity-90 hover:shadow-xl"
              style={{ backgroundColor: "#E8A838" }}
            >
              申请加盟名额
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white text-base border-2 border-white/50 hover:bg-white/10 transition-all duration-200"
            >
              预约专属顾问
            </Link>
          </div>
          <p className="mt-8 text-blue-300 text-sm">
            招商热线：<span className="font-bold text-white">400-888-0001</span>
            （周一至周日 9:00-18:00）
          </p>
        </div>
      </section>
    </div>
  );
}
