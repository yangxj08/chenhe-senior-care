import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role

  if (!session || userRole !== 'SUPER_ADMIN') {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
