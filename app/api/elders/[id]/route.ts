import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

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

  const elder = await prisma.elder.findUnique({
    where: { id },
    include: {
      careRecords: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { nurse: { select: { name: true } } },
      },
      billings: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!elder) {
    return Response.json({ error: '老人不存在' }, { status: 404 })
  }

  if (elder.organizationId !== organizationId) {
    return Response.json({ error: '无权访问' }, { status: 403 })
  }

  return Response.json(elder)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  const { id } = await params

  const existing = await prisma.elder.findUnique({ where: { id } })
  if (!existing) {
    return Response.json({ error: '老人不存在' }, { status: 404 })
  }
  if (existing.organizationId !== organizationId) {
    return Response.json({ error: '无权操作' }, { status: 403 })
  }

  const body = await request.json()
  const elder = await prisma.elder.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.gender !== undefined ? { gender: body.gender } : {}),
      ...(body.age !== undefined ? { age: Number(body.age) } : {}),
      ...(body.idCard !== undefined ? { idCard: body.idCard } : {}),
      ...(body.phone !== undefined ? { phone: body.phone } : {}),
      ...(body.emergencyContact !== undefined ? { emergencyContact: body.emergencyContact } : {}),
      ...(body.emergencyPhone !== undefined ? { emergencyPhone: body.emergencyPhone } : {}),
      ...(body.careLevel !== undefined ? { careLevel: body.careLevel } : {}),
      ...(body.roomNumber !== undefined ? { roomNumber: body.roomNumber } : {}),
      ...(body.bedNumber !== undefined ? { bedNumber: body.bedNumber } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
  })

  return Response.json(elder)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  const { id } = await params

  const existing = await prisma.elder.findUnique({ where: { id } })
  if (!existing) {
    return Response.json({ error: '老人不存在' }, { status: 404 })
  }
  if (existing.organizationId !== organizationId) {
    return Response.json({ error: '无权操作' }, { status: 403 })
  }

  await prisma.elder.delete({ where: { id } })
  return Response.json({ success: true })
}
