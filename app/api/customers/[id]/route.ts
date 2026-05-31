import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

const VALID_STATUS = ['LEAD', 'VISITING', 'NEGOTIATING', 'SIGNED', 'LOST']
const VALID_SOURCE = ['REFERRAL', 'WALK_IN', 'ONLINE', 'HOSPITAL', 'GOV']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  const { id } = await params

  const customer = await prisma.customer.findUnique({ where: { id } })
  if (!customer) {
    return Response.json({ error: '客户不存在' }, { status: 404 })
  }
  if (customer.organizationId !== organizationId) {
    return Response.json({ error: '无权访问' }, { status: 403 })
  }

  return Response.json(customer)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const role = (session.user as any)?.role
  if (!['ORG_ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return Response.json({ error: '权限不足' }, { status: 403 })
  }

  const organizationId = (session.user as any)?.organizationId
  const { id } = await params

  const existing = await prisma.customer.findUnique({ where: { id } })
  if (!existing) {
    return Response.json({ error: '客户不存在' }, { status: 404 })
  }
  if (existing.organizationId !== organizationId) {
    return Response.json({ error: '无权操作' }, { status: 403 })
  }

  const body = await request.json()

  // 字段校验
  if (body.name !== undefined && (!body.name || typeof body.name !== 'string')) {
    return Response.json({ error: '客户姓名为必填项' }, { status: 400 })
  }
  if (body.status !== undefined && body.status && !VALID_STATUS.includes(body.status)) {
    return Response.json({ error: '无效的客户状态' }, { status: 400 })
  }
  if (body.source !== undefined && body.source && !VALID_SOURCE.includes(body.source)) {
    return Response.json({ error: '无效的来源渠道' }, { status: 400 })
  }

  // 显式白名单字段，防止 mass-assignment
  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = String(body.name)
  if (body.phone !== undefined) data.phone = body.phone ? String(body.phone) : null
  if (body.email !== undefined) data.email = body.email ? String(body.email) : null
  if (body.gender !== undefined) data.gender = body.gender ? String(body.gender) : null
  if (body.age !== undefined) data.age = body.age ? Number(body.age) : null
  if (body.source !== undefined) data.source = body.source || null
  if (body.status !== undefined) data.status = body.status || 'LEAD'
  if (body.elderName !== undefined) data.elderName = body.elderName ? String(body.elderName) : null
  if (body.elderAge !== undefined) data.elderAge = body.elderAge ? Number(body.elderAge) : null
  if (body.careNeed !== undefined) data.careNeed = body.careNeed ? String(body.careNeed) : null
  if (body.budget !== undefined) data.budget = body.budget ? String(body.budget) : null
  if (body.visitDate !== undefined) data.visitDate = body.visitDate ? new Date(body.visitDate) : null
  if (body.followUpDate !== undefined) data.followUpDate = body.followUpDate ? new Date(body.followUpDate) : null
  if (body.assignedTo !== undefined) data.assignedTo = body.assignedTo ? String(body.assignedTo) : null
  if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null

  const customer = await prisma.customer.update({
    where: { id },
    data,
  })

  return Response.json(customer)
}
