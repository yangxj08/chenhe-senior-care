"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, CheckCircle, Map } from "lucide-react";

// ─────────────────────────────────────────────
// 联系信息数据
// ─────────────────────────────────────────────

const contactCards = [
  {
    icon: Phone,
    title: "招商热线",
    primary: "400-888-0001",
    secondary: "周一至周日 9:00-18:00",
    bgColor: "#f0f6ff",
    iconBg: "#2E75B6",
    action: { label: "立即拨打", href: "tel:4008880001" },
  },
  {
    icon: Mail,
    title: "邮箱联系",
    primary: "join@chenhe-care.com",
    secondary: "24小时内回复",
    bgColor: "#fffbf0",
    iconBg: "#E8A838",
    action: { label: "发送邮件", href: "mailto:join@chenhe-care.com" },
  },
  {
    icon: MapPin,
    title: "总部地址",
    primary: "湖南省郴州市苏仙区",
    secondary: "郴州大道XX号郴和养老大厦",
    bgColor: "#f5f7fa",
    iconBg: "#1a2e45",
    action: { label: "查看地图", href: "#map" },
  },
  {
    icon: MessageSquare,
    title: "微信客服",
    primary: "扫码添加客服微信",
    secondary: "回复更快，7×16小时在线",
    bgColor: "#f0fff4",
    iconBg: "#16a34a",
    action: { label: "获取二维码", href: "#wechat" },
  },
];

// ─────────────────────────────────────────────
// 咨询表单
// ─────────────────────────────────────────────

function ConsultForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          我们已收到您的咨询
        </h3>
        <p className="text-gray-500 text-sm">
          顾问将在工作时间内尽快与您联系，感谢您对郴和养老的关注。
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
            placeholder="请输入姓名"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors"
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
            placeholder="请输入手机号"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          咨询主题 <span className="text-red-500">*</span>
        </label>
        <select
          name="topic"
          required
          value={form.topic}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors bg-white"
        >
          <option value="" disabled>
            请选择咨询主题
          </option>
          <option value="elderly-admission">长辈入住咨询</option>
          <option value="service-inquiry">服务套餐详情</option>
          <option value="franchise-a">产品A合伙人投资咨询</option>
          <option value="franchise-b">产品B加盟运营咨询</option>
          <option value="visit">预约参观机构</option>
          <option value="other">其他问题</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          详细描述（选填）
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="请详细描述您的需求或问题，以便我们为您提供更精准的解答"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E75B6] focus:ring-1 focus:ring-[#2E75B6] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
        style={{ backgroundColor: "#2E75B6" }}
      >
        {loading ? "提交中..." : "提交咨询"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        我们承诺保护您的个人隐私，信息仅用于服务咨询，绝不泄露给任何第三方。
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// 页面
// ─────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section
        className="py-24 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #1a2e45 0%, #2E75B6 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(232,168,56,0.2)", color: "#E8A838" }}
          >
            联系我们
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            我们随时准备
            <br />
            为您解答
          </h1>
          <p className="text-blue-100 text-lg">
            无论是养老入住咨询，还是加盟合作洽谈，
            <br className="hidden sm:block" />
            郴和养老的专业团队期待与您沟通。
          </p>
        </div>
      </section>

      {/* ── 联系信息卡片 ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
              <div
                key={card.title}
                className="rounded-2xl p-6 hover:shadow-md transition-shadow"
                style={{ backgroundColor: card.bgColor }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{card.title}</h3>
                <p
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: card.iconBg }}
                >
                  {card.primary}
                </p>
                <p className="text-gray-400 text-xs mb-4">{card.secondary}</p>
                <a
                  href={card.action.href}
                  className="inline-block text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: card.iconBg }}
                >
                  {card.action.label}
                </a>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 咨询表单 + 侧边信息 ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 左侧：表单 */}
            <div>
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "#E8A838" }}
              >
                在线咨询
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-2">
                发送您的咨询
              </h2>
              <p className="text-gray-500 mb-8">
                填写下方表单，我们的顾问将优先回复您的问题。
              </p>
              <ConsultForm />
            </div>

            {/* 右侧：附加信息 */}
            <div className="space-y-6">
              <div>
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: "#E8A838" }}
                >
                  快速了解
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                  您可能想知道
                </h2>
              </div>

              {[
                {
                  q: "如何预约参观机构？",
                  a: "拨打招商热线400-888-0001，或填写咨询表单选择「预约参观机构」，我们将安排专属导览。",
                },
                {
                  q: "入住需要哪些手续？",
                  a: "基本材料包括身份证、户口本、近期体检报告，以及监护人联系信息。我们的入住顾问会全程指引。",
                },
                {
                  q: "加盟合作洽谈周期多久？",
                  a: "从初次咨询到正式签约，通常需要2-4周，具体取决于双方评估进度和合同谈判情况。",
                },
                {
                  q: "总部在哪里？",
                  a: "郴和养老总部位于湖南省郴州市，欢迎有意向的合作伙伴来访考察，我们将安排接待和旗舰机构参观。",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-gray-100 hover:border-[#2E75B6] transition-colors"
                >
                  <h4
                    className="font-semibold text-gray-900 mb-2 flex items-start gap-2"
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#2E75B6" }}
                    >
                      Q
                    </span>
                    {item.q}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed pl-7">
                    {item.a}
                  </p>
                </div>
              ))}

              {/* 紧急联系提示 */}
              <div
                className="p-5 rounded-xl"
                style={{ backgroundColor: "#f0f6ff" }}
              >
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "#2E75B6" }}
                >
                  紧急联系
                </p>
                <p className="text-gray-600 text-sm">
                  如家中老人有紧急养老需求，请直接拨打
                  <a
                    href="tel:4008880001"
                    className="font-bold mx-1"
                    style={{ color: "#2E75B6" }}
                  >
                    400-888-0001
                  </a>
                  ，我们7×12小时接听紧急来电，优先安排床位。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 底部地图占位 + 机构分布 ── */}
      <section className="py-16 bg-gray-50" id="map">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">全国机构分布</h2>
            <p className="text-gray-500 mt-2 text-sm">
              目前已布局10+城市，更多城市正在招募加盟伙伴
            </p>
          </div>
          <div
            className="w-full h-56 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200"
            style={{ backgroundColor: "#f5f7fa" }}
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <Map className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">全国机构分布地图</p>
              <p className="text-gray-300 text-xs mt-1">（集成地图 API 后展示）</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {[
              "湖南·郴州（总部）",
              "湖南·长沙",
              "湖南·株洲",
              "湖南·衡阳",
              "广东·深圳",
              "广东·广州",
              "湖北·武汉",
              "江西·南昌",
              "浙江·杭州",
              "北京（筹）",
            ].map((city) => (
              <div
                key={city}
                className="text-center py-3 px-2 rounded-xl text-sm font-medium bg-white shadow-sm"
                style={{
                  color: city.includes("总部") ? "#2E75B6" : city.includes("筹") ? "#9ca3af" : "#374151",
                }}
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
