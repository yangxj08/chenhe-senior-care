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
  const search = searchParams.get('search') ?? ''
  const careLevel = searchParams.get('careLevel') ?? ''

  const elders = await prisma.elder.findMany({
    where: {
      organizationId,
      ...(careLevel ? { careLevel } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { roomNumber: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { admissionDate: 'desc' },
  })

  return Response.json(elders)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: '未登录' }, { status: 401 })
  }

  const organizationId = (session.user as any)?.organizationId
  if (!organizationId) {
    return Response.json({ error: '未关联机构' }, { status: 403 })
  }

  const body = await request.json()
  const {
    name,
    gender,
    age,
    idCard,
    phone,
    emergencyContact,
    emergencyPhone,
    careLevel,
    roomNumber,
    bedNumber,
    notes,
  } = body

  if (!name || !gender || !age || !careLevel || !emergencyContact || !emergencyPhone) {
    return Response.json({ error: '请填写必填项' }, { status: 400 })
  }

  const elder = await prisma.elder.create({
    data: {
      name,
      gender,
      age: Number(age),
      idCard: idCard || null,
      phone: phone || null,
      emergencyContact,
      emergencyPhone,
      careLevel,
      roomNumber: roomNumber || null,
      bedNumber: bedNumber || null,
      notes: notes || null,
      organizationId,
    },
  })

  return Response.json(elder, { status: 201 })
}
