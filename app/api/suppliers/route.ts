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

  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: '供应商名称为必填项' }, { status: 400 })
  }
  const validCategories = ['FOOD', 'MEDICINE', 'EQUIPMENT', 'CONSUMABLE', 'OTHER']
  if (body.category && !validCategories.includes(body.category)) {
    return NextResponse.json({ error: '无效的供应商分类' }, { status: 400 })
  }

  const supplier = await prisma.supplier.create({
    data: {
      name: String(body.name),
      category: body.category || 'OTHER',
      contactName: body.contactName ? String(body.contactName) : null,
      contactPhone: body.contactPhone ? String(body.contactPhone) : null,
      contactEmail: body.contactEmail ? String(body.contactEmail) : null,
      address: body.address ? String(body.address) : null,
      rating: body.rating ? Math.min(5, Math.max(1, Number(body.rating))) : 3,
      status: body.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      notes: body.notes ? String(body.notes) : null,
      organizationId: orgId,
    },
  })
  return NextResponse.json(supplier, { status: 201 })
}
