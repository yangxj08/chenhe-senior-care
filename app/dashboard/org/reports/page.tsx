import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ReportsClient from './ReportsClient'

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (role === 'NURSE') redirect('/dashboard/org')
  return <ReportsClient />
}
