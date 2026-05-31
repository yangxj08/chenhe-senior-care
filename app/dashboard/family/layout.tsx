import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const metadata = {
  title: '家属服务 - 郴和养老',
}

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role

  if (!session || userRole !== 'FAMILY') {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
