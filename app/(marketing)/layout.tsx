"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我们" },
  { href: "/services", label: "服务项目" },
  { href: "/franchise", label: "加盟合作" },
  { href: "/contact", label: "联系我们" },
];

const footerColumns = [
  {
    title: "郴和养老",
    items: [
      "专注高品质养老服务",
      "医养结合，专业护理",
      "用心守护每一位长辈",
      "打造幸福晚年生活",
    ],
    isText: true,
  },
  {
    title: "服务项目",
    links: [
      { href: "/services#basic", label: "A级基础养老" },
      { href: "/services#standard", label: "B级标准养老" },
      { href: "/services#premium", label: "C级高端养老" },
      { href: "/services#daycare", label: "日托服务" },
      { href: "/services#medical", label: "医养结合" },
    ],
  },
  {
    title: "加盟支持",
    links: [
      { href: "/franchise", label: "加盟概览" },
      { href: "/franchise#process", label: "加盟流程" },
      { href: "/franchise#investment", label: "投资回报" },
      { href: "/franchise#faq", label: "常见问题" },
      { href: "/franchise#apply", label: "立即申请" },
    ],
  },
  {
    title: "联系我们",
    contacts: [
      { icon: Phone, text: "招商热线：400-888-0001" },
      { icon: Mail, text: "邮箱：join@chenhe-care.com" },
      { icon: MapPin, text: "总部：湖南省郴州市" },
      { icon: Clock, text: "工作时间：周一至周日 9:00-18:00" },
    ],
  },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部固定导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: "#2E75B6" }}
              >
                郴
              </div>
              <span
                className="text-xl font-bold hidden sm:block"
                style={{ color: "#2E75B6" }}
              >
                郴和养老
              </span>
            </Link>

            {/* 桌面端导航链接 */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-[#2E75B6] font-medium text-sm transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200"
                    style={{ backgroundColor: "#2E75B6" }}
                  />
                </Link>
              ))}
            </nav>

            {/* 桌面端按钮组 */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2E75B6] border border-gray-300 hover:border-[#2E75B6] rounded-lg transition-all duration-200"
              >
                登录
              </Link>
              <Link
                href="/franchise#apply"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:opacity-90 shadow-sm"
                style={{ backgroundColor: "#E8A838" }}
              >
                申请加盟
              </Link>
            </div>

            {/* 移动端汉堡菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="打开菜单"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-gray-600 transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gray-600 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gray-600 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* 移动端菜单下拉 */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-gray-700 hover:text-[#2E75B6] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-1">
              <Link
                href="/login"
                className="flex-1 py-2 text-center text-sm font-medium text-gray-600 border border-gray-300 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/franchise#apply"
                className="flex-1 py-2 text-center text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: "#E8A838" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                申请加盟
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 主内容区，顶部留出导航高度 */}
      <main className="flex-1 pt-16">{children}</main>

      {/* 底部 Footer */}
      <footer style={{ backgroundColor: "#1a2e45" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* 第一列：品牌介绍 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: "#2E75B6" }}
                >
                  郴
                </div>
                <span className="text-lg font-bold">郴和养老</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                专注高品质养老服务，以医养结合为核心，为长辈提供专业、温馨、安全的晚年生活。
              </p>
              <div className="flex gap-3">
                {["微信", "微博", "抖音"].map((social) => (
                  <div
                    key={social}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "#2E75B6" }}
                  >
                    {social[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* 第二列：服务项目 */}
            <div>
              <h3 className="font-bold text-base mb-4 text-white">服务项目</h3>
              <ul className="space-y-2">
                {footerColumns[1].links!.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 第三列：加盟支持 */}
            <div>
              <h3 className="font-bold text-base mb-4 text-white">加盟支持</h3>
              <ul className="space-y-2">
                {footerColumns[2].links!.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 第四列：联系我们 */}
            <div>
              <h3 className="font-bold text-base mb-4 text-white">联系我们</h3>
              <ul className="space-y-3">
                {footerColumns[3].contacts!.map((item, i) => {
                  const Icon = item.icon as React.ElementType;
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Icon className="w-3.5 h-3.5 text-blue-300 shrink-0 mt-0.5" />
                      <span className="text-gray-400">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* 底部版权栏 */}
          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-500 text-sm">
              © 2024 郴和养老科技有限公司. 保留所有权利.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-300 text-sm"
              >
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
