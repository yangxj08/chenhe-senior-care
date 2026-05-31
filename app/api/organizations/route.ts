import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = (session.user as any).role
  if (role !== 'SUPER_ADMIN') return NextResponse.json({ error: '权限不足' }, { status: 403 })
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(orgs)
}

const VALID_PLANS = ['BASIC', 'PROFESSIONAL', 'ENTERPRISE']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 仅超级管理员可创建机构
  const role = (session.user as any).role
  if (role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足，仅总部可创建机构' }, { status: 403 })
  }

  const body = await req.json()
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: '机构名称为必填项' }, { status: 400 })
  }
  if (!body.code || typeof body.code !== 'string') {
    return NextResponse.json({ error: '机构编码为必填项' }, { status: 400 })
  }
  if (body.plan && !VALID_PLANS.includes(body.plan)) {
    return NextResponse.json({ error: '无效的套餐类型' }, { status: 400 })
  }

  // 编码唯一性检查
  const existing = await prisma.organization.findUnique({ where: { code: body.code } })
  if (existing) {
    return NextResponse.json({ error: '机构编码已存在' }, { status: 409 })
  }

  const org = await prisma.organization.create({
    data: {
      name: String(body.name),
      code: String(body.code),
      address: body.address ? String(body.address) : null,
      phone: body.phone ? String(body.phone) : null,
      plan: body.plan || 'BASIC',
      status: 'ACTIVE',
    },
  })
  return NextResponse.json(org, { status: 201 })
}
