import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = (session.user as any).organizationId
  const status = req.nextUrl.searchParams.get('status')

  const customers = await prisma.customer.findMany({
    where: { organizationId: orgId, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(customers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orgId = (session.user as any).organizationId
  const body = await req.json()

  const customer = await prisma.customer.create({
    data: { ...body, organizationId: orgId },
  })

  return NextResponse.json(customer, { status: 201 })
}
