// 纯透传布局 — 每个角色的子路由 layout 各自负责渲染 DashboardLayout
// 不在此处添加任何包裹，避免双重侧边栏/Header
export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
