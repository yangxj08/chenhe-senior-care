import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/admin',
  ORG_ADMIN:   '/dashboard/org',
  NURSE:       '/dashboard/org',
  FAMILY:      '/dashboard/family',
  INVESTOR:    '/dashboard/investor',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  const role = (session.user as any)?.role as string
  redirect(ROLE_ROUTES[role] ?? '/dashboard/org')
}
