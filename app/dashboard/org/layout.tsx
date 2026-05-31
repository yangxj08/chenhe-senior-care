import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role

  if (!session || (userRole !== 'ORG_ADMIN' && userRole !== 'NURSE')) {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
