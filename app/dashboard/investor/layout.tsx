import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const metadata = {
  title: '投资人门户 - 郴和养老',
}

export default async function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role

  if (!session || userRole !== 'INVESTOR') {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
