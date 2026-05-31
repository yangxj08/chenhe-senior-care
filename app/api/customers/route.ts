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

const VALID_STATUS = ['LEAD', 'VISITING', 'NEGOTIATING', 'SIGNED', 'LOST']
const VALID_SOURCE = ['REFERRAL', 'WALK_IN', 'ONLINE', 'HOSPITAL', 'GOV']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role
  if (!['ORG_ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const orgId = (session.user as any).organizationId
  const body = await req.json()

  // 显式白名单字段，防止 mass-assignment
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: '客户姓名为必填项' }, { status: 400 })
  }
  if (body.status && !VALID_STATUS.includes(body.status)) {
    return NextResponse.json({ error: '无效的客户状态' }, { status: 400 })
  }
  if (body.source && !VALID_SOURCE.includes(body.source)) {
    return NextResponse.json({ error: '无效的来源渠道' }, { status: 400 })
  }

  const customer = await prisma.customer.create({
    data: {
      name: String(body.name),
      phone: body.phone ? String(body.phone) : null,
      email: body.email ? String(body.email) : null,
      gender: body.gender ? String(body.gender) : null,
      age: body.age ? Number(body.age) : null,
      source: body.source || null,
      status: body.status || 'LEAD',
      elderName: body.elderName ? String(body.elderName) : null,
      elderAge: body.elderAge ? Number(body.elderAge) : null,
      careNeed: body.careNeed ? String(body.careNeed) : null,
      budget: body.budget ? String(body.budget) : null,
      assignedTo: body.assignedTo ? String(body.assignedTo) : null,
      notes: body.notes ? String(body.notes) : null,
      organizationId: orgId,
    },
  })

  return NextResponse.json(customer, { status: 201 })
}
