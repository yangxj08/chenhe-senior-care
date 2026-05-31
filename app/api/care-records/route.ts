import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  if (!organizationId) {
    return Response.json({ error: '未关联机构' }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const elderId = searchParams.get('elderId') ?? ''
  const type = searchParams.get('type') ?? ''

  const records = await prisma.careRecord.findMany({
    where: {
      organizationId,
      ...(elderId ? { elderId } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      elder: { select: { id: true, name: true, roomNumber: true } },
      nurse: { select: { id: true, name: true } },
    },
  })

  return Response.json(records)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  const nurseId = (session.user as any)?.id

  if (!organizationId) {
    return Response.json({ error: '未关联机构' }, { status: 403 })
  }
  if (!nurseId) {
    return Response.json({ error: '无法获取用户信息' }, { status: 403 })
  }

  const body = await request.json()
  const { elderId, type, description, temperature, bloodPressure, pulse, mood } = body

  if (!elderId || !type || !description) {
    return Response.json({ error: '请填写必填项' }, { status: 400 })
  }

  // Verify elder belongs to same organization
  const elder = await prisma.elder.findUnique({ where: { id: elderId } })
  if (!elder || elder.organizationId !== organizationId) {
    return Response.json({ error: '老人不存在或无权访问' }, { status: 403 })
  }

  const record = await prisma.careRecord.create({
    data: {
      elderId,
      nurseId,
      type,
      description,
      temperature: temperature ? Number(temperature) : null,
      bloodPressure: bloodPressure || null,
      pulse: pulse ? Number(pulse) : null,
      mood: mood || null,
      organizationId,
    },
    include: {
      elder: { select: { id: true, name: true } },
      nurse: { select: { id: true, name: true } },
    },
  })

  return Response.json(record, { status: 201 })
}
