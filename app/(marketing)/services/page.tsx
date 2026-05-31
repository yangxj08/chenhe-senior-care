import Link from "next/link";
import { Stethoscope, Pill, Activity, Siren } from "lucide-react";

// ─────────────────────────────────────────────
// 数据
// ─────────────────────────────────────────────

const serviceTiers = [
  {
    id: "basic",
    tier: "A级",
    name: "基础养老套餐",
    price: "3,500",
    color: "#2E75B6",
    bgColor: "#f0f6ff",
    tagline: "温馨舒适，基础保障",
    roomSize: "标准单人间 20㎡",
    categories: [
      {
        name: "居住条件",
        items: [
          "独立标准单人间（约20㎡）",
          "独立卫浴，24小时热水",
          "中央空调及新风系统",
          "紧急呼叫设备",
        ],
      },
      {
        name: "餐饮服务",
        items: [
          "三餐营养配餐，中西式早餐",
          "根据医嘱提供定制膳食",
          "下午茶及营养加餐",
        ],
      },
      {
        name: "护理服务",
        items: [
          "早晚基础护理（洗漱/整理）",
          "每日生命体征监测",
          "服药提醒与管理",
          "24小时护士值班",
        ],
      },
      {
        name: "医疗保障",
        items: [
          "每周医生查房1次",
          "基础健康档案建立",
          "协助就医及急救转诊",
        ],
      },
      {
        name: "文娱活动",
        items: [
          "公共活动区域使用权",
          "每日集体文娱活动",
          "图书室、棋牌室开放",
        ],
      },
    ],
  },
  {
    id: "standard",
    tier: "B级",
    name: "标准养老套餐",
    price: "4,500",
    color: "#E8A838",
    bgColor: "#fffbf0",
    tagline: "全面贴心，专属关怀",
    roomSize: "舒适套间 35㎡",
    highlight: true,
    categories: [
      {
        name: "居住条件",
        items: [
          "舒适套间（约35㎡）",
          "独立客厅+卧室布局",
          "高档家具配置，氛围温馨",
          "智能床位传感器",
        ],
      },
      {
        name: "餐饮服务",
        items: [
          "个性化营养餐饮方案",
          "专职营养师每月评估",
          "生日专属蛋糕及庆典",
          "可选家庭聚餐包间",
        ],
      },
      {
        name: "护理服务",
        items: [
          "一对一专属护理师",
          "每日全身护理服务",
          "康复训练课程（每周3次）",
          "心理关怀与情绪疏导",
        ],
      },
      {
        name: "医疗保障",
        items: [
          "每周医生查房2次",
          "全科定期体检（每季度）",
          "慢病管理方案定制",
          "中医调理服务",
        ],
      },
      {
        name: "增值服务",
        items: [
          "家属APP实时查看动态",
          "每月家庭沟通报告",
          "节假日家庭探视接待",
          "老年大学课程参与",
        ],
      },
    ],
  },
  {
    id: "premium",
    tier: "C级",
    name: "高端养老套餐",
    price: "5,800",
    color: "#1a2e45",
    bgColor: "#f5f7fa",
    tagline: "尊贵私享，卓越品质",
    roomSize: "豪华套房 55㎡+",
    categories: [
      {
        name: "居住条件",
        items: [
          "豪华套房（55㎡以上）",
          "双卧室+客厅+阳台",
          "精装修，艺术品布置",
          "专属园景或湖景房源",
        ],
      },
      {
        name: "餐饮服务",
        items: [
          "私人营养师全程定制",
          "多国菜系灵活点餐",
          "高端食材特供",
          "VIP餐厅包间专享",
        ],
      },
      {
        name: "护理服务",
        items: [
          "专属护理管家（1对1）",
          "24小时贴身护理",
          "个人清洁、着装协助",
          "高级康复治疗师指导",
        ],
      },
      {
        name: "医疗保障",
        items: [
          "全科医生驻场，随叫随到",
          "三甲医院直通绿色通道",
          "每月全面健康评估",
          "心理咨询师定期面谈",
        ],
      },
      {
        name: "尊享服务",
        items: [
          "出行陪同（就医/购物/出游）",
          "家属VIP接待厅专享",
          "代办日常事务服务",
          "紧急救护专车24小时待命",
        ],
      },
    ],
  },
];

const medicalServices = [
  {
    icon: Stethoscope,
    title: "全科医疗驻场",
    desc: "配备全科医生、护士、康复治疗师，A级每周查房，B/C级常驻，确保医疗响应及时。",
  },
  {
    icon: Pill,
    title: "慢病精准管理",
    desc: "针对高血压、糖尿病、心脑血管疾病等老年常见病，制定个性化管理方案并动态调整。",
  },
  {
    icon: Activity,
    title: "康复治疗体系",
    desc: "专业物理治疗、作业治疗、言语治疗，配备先进康复设备，助力长辈恢复功能、提升生活质量。",
  },
  {
    icon: Siren,
    title: "急救绿色通道",
    desc: "与三甲医院建立直联机制，紧急情况可在30分钟内完成转诊，降低突发风险。",
  },
];

const daycareFeatures = [
  { time: "08:30", activity: "接送入托，健康晨检" },
  { time: "09:00", activity: "早操/太极/健康操" },
  { time: "10:00", activity: "益智活动（书法/绘画/棋牌）" },
  { time: "11:30", activity: "营养午餐配送" },
  { time: "13:00", activity: "午休" },
  { time: "14:30", activity: "健康讲座/文娱节目" },
  { time: "16:00", activity: "下午茶" },
  { time: "17:00", activity: "接送返家" },
];

// 价格对比表
const comparisonRows = [
  { feature: "居住空间", a: "20㎡单人间", b: "35㎡套间", c: "55㎡+豪华套房" },
  { feature: "餐饮", a: "标准三餐", b: "个性化定制", c: "私人营养师" },
  { feature: "护理模式", a: "团队护理", b: "1对1专属", c: "管家式贴身" },
  { feature: "医生查房", a: "每周1次", b: "每周2次", c: "全科驻场随叫" },
  { feature: "康复训练", a: "不含", b: "每周3次", c: "每日个性化" },
  { feature: "心理疏导", a: "不含", b: "含", c: "咨询师定期面谈" },
  { feature: "家属APP", a: "基础版", b: "完整版", c: "VIP版+月报" },
  { feature: "出行陪同", a: "不含", b: "不含", c: "含（专车接送）" },
  { feature: "月费（起）", a: "¥3,500", b: "¥4,500", c: "¥5,800" },
];

// ─────────────────────────────────────────────
// 页面组件
// ─────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section
        className="py-24 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #1a2e45 0%, #2E75B6 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(232,168,56,0.2)", color: "#E8A838" }}
          >
            服务项目
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            专业养老服务，适合每一个家庭
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            三档服务满足不同需求与预算，医养结合核心保障贯穿始终。无论您选择哪一档，长辈都将获得专业、温馨、安全的照护。
          </p>
        </div>
      </section>

      {/* ── 三档服务详细清单 ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              三档套餐
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              详细服务清单
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {serviceTiers.map((tier) => (
              <div
                key={tier.id}
                id={tier.id}
                className={`rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow ${
                  tier.highlight ? "ring-2 ring-[#E8A838]" : ""
                }`}
              >
                {/* 卡片头部 */}
                <div
                  className="p-6 text-white"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.highlight && (
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider opacity-90">
                      最受欢迎
                    </div>
                  )}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-medium opacity-80">{tier.tier}</span>
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                      <p className="text-sm opacity-75 mt-1">{tier.tagline}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold">¥{tier.price}</span>
                      <p className="text-xs opacity-75">元/月起</p>
                    </div>
                  </div>
                  <div
                    className="mt-3 text-xs px-2 py-1 rounded-full inline-block font-medium"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {tier.roomSize}
                  </div>
                </div>

                {/* 服务清单 */}
                <div className="p-6 space-y-5">
                  {tier.categories.map((cat) => (
                    <div key={cat.name}>
                      <h4
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: tier.color }}
                      >
                        {cat.name}
                      </h4>
                      <ul className="space-y-1.5">
                        {cat.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span
                              className="mt-0.5 flex-shrink-0 font-bold"
                              style={{ color: tier.color }}
                            >
                              ✓
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link
                    href="/contact"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm mt-4 transition-all hover:opacity-90"
                    style={{ backgroundColor: tier.color, color: "white" }}
                  >
                    预约参观咨询
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 医养结合 ── */}
      <section className="py-20 bg-white" id="medical">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              医养结合
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              专业医疗，全程守护
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              与三甲医院深度合作，医疗资源嵌入养老服务全流程，做到病有所医、老有所养。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalServices.map((s) => (
              <div
                key={s.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#2E75B6] hover:shadow-md transition-all group"
              >
                <div className="mb-4">
                  <s.icon className="w-10 h-10 text-[#2E75B6]" />
                </div>
                <h3
                  className="font-bold text-gray-900 mb-2 group-hover:text-[#2E75B6] transition-colors"
                >
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 日托服务 ── */}
      <section
        className="py-20"
        id="daycare"
        style={{ backgroundColor: "#f0f6ff" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              日托服务
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              白天托管，让家人安心上班
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              为居家养老的长辈提供专业白天照护服务，享受机构级护理与文娱活动，傍晚安然回家。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#2E75B6" }}
              >
                一日作息安排
              </h3>
              <div className="space-y-3">
                {daycareFeatures.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span
                      className="text-sm font-bold w-14 flex-shrink-0"
                      style={{ color: "#2E75B6" }}
                    >
                      {item.time}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#E8A838" }}
                    />
                    <span className="text-gray-700 text-sm">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "灵活接送",
                  desc: "提供上下门接送服务，半径5公里内覆盖，家属可安心上班。",
                },
                {
                  title: "营养午餐",
                  desc: "专业营养师搭配，软食、流食、普通餐灵活选择。",
                },
                {
                  title: "日费透明",
                  desc: "按日计费，¥150/天起，无最低入托天数限制。",
                },
                {
                  title: "健康记录",
                  desc: "每日记录活动情况与健康状态，通过APP实时推送家属。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white p-5 rounded-xl shadow-sm flex gap-4"
                >
                  <div
                    className="w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "#2E75B6" }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 价格对比表 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#E8A838" }}
            >
              套餐对比
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              清晰的价格与服务对比
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1a2e45" }}>
                  <th className="text-left px-6 py-4 text-white font-semibold w-1/4">
                    服务内容
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-center"
                    style={{ color: "#93c5fd" }}
                  >
                    A级 基础
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-center"
                    style={{ color: "#E8A838" }}
                  >
                    B级 标准 ★
                  </th>
                  <th
                    className="px-6 py-4 font-semibold text-center text-blue-200"
                  >
                    C级 高端
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-700">
                      {row.feature}
                    </td>
                    <td className="px-6 py-3.5 text-center text-gray-600">
                      {row.a}
                    </td>
                    <td
                      className="px-6 py-3.5 text-center font-medium"
                      style={{ color: "#E8A838" }}
                    >
                      {row.b}
                    </td>
                    <td className="px-6 py-3.5 text-center text-gray-700">
                      {row.c}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-400 text-xs text-center mt-4">
            * 以上价格为基础起始价，实际费用因入住时长、护理等级、房型等因素有所差异，欢迎来电咨询。
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 text-center text-white"
        style={{ backgroundColor: "#2E75B6" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            不确定哪档套餐适合您的长辈？
          </h2>
          <p className="text-blue-100 mb-8">
            我们的专业顾问将免费为您提供一对一评估，帮助选择最合适的养老方案。
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:shadow-xl"
            style={{ backgroundColor: "#E8A838" }}
          >
            免费获取专业建议
          </Link>
        </div>
      </section>
    </div>
  );
}
