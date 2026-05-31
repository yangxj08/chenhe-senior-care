import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orgId = (session.user as any).organizationId
  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: orgId },
    include: { _count: { select: { purchaseOrders: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(suppliers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role
  if (!['ORG_ADMIN', 'SUPER_ADMIN'].includes(role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const orgId = (session.user as any).organizationId
  const body = await req.json()
  const supplier = await prisma.supplier.create({ data: { ...body, organizationId: orgId } })
  return NextResponse.json(supplier, { status: 201 })
}
