import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/billing?month=2024-06
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: '未登录，请先登录' }, { status: 401 })
  }

  const orgId = (session.user as any)?.organizationId
  const role = (session.user as any)?.role
  if (!orgId) return Response.json({ error: '无机构权限' }, { status: 403 })
  if (role === 'NURSE') return Response.json({ error: '护理员无权访问账单数据' }, { status: 403 })

  const { searchParams } = request.nextUrl
  const month = searchParams.get('month')

  const whereClause = {
    organizationId: orgId,
    ...(month ? { month } : {}),
  }

  try {
    const records = await prisma.billingRecord.findMany({
      where: whereClause,
      include: { elder: true },
      orderBy: { createdAt: 'desc' },
    })

    const total = records.reduce((sum, r) => sum + r.total, 0)
    const paid = records
      .filter((r) => r.status === 'PAID')
      .reduce((sum, r) => sum + r.total, 0)
    const unpaid = records
      .filter((r) => r.status === 'UNPAID')
      .reduce((sum, r) => sum + r.total, 0)
    const overdue = records
      .filter((r) => r.status === 'OVERDUE')
      .reduce((sum, r) => sum + r.total, 0)

    return Response.json({
      records,
      summary: { total, paid, unpaid, overdue, count: records.length },
    })
  } catch (error) {
    console.error('[GET /api/billing]', error)
    return Response.json({ error: '查询账单失败' }, { status: 500 })
  }
}

// POST /api/billing
// Body: { elderId, month, baseFee, careFee, medicineFee, otherFee }
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return Response.json({ error: '未登录，请先登录' }, { status: 401 })
  }

  const orgId = (session.user as any)?.organizationId
  const role = (session.user as any)?.role
  if (!orgId) {
    return Response.json({ error: '无机构权限' }, { status: 403 })
  }
  if (role !== 'ORG_ADMIN' && role !== 'SUPER_ADMIN') {
    return Response.json({ error: '权限不足，仅管理员可创建账单' }, { status: 403 })
  }

  let body: {
    elderId?: string
    month?: string
    baseFee?: number
    careFee?: number
    medicineFee?: number
    otherFee?: number
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: '请求体格式错误' }, { status: 400 })
  }

  const { elderId, month, baseFee = 0, careFee = 0, medicineFee = 0, otherFee = 0 } = body

  if (!elderId || !month) {
    return Response.json({ error: '缺少必填字段：elderId 和 month' }, { status: 400 })
  }

  // Verify elder belongs to this organization
  const elder = await prisma.elder.findFirst({
    where: { id: elderId, organizationId: orgId },
  })
  if (!elder) {
    return Response.json({ error: '老人不存在或不属于本机构' }, { status: 404 })
  }

  // Check for duplicate billing (same elder + month)
  const existing = await prisma.billingRecord.findFirst({
    where: { elderId, month, organizationId: orgId },
  })
  if (existing) {
    return Response.json(
      { error: `${elder.name} 的 ${month} 账单已存在` },
      { status: 409 }
    )
  }

  const total = baseFee + careFee + medicineFee + otherFee

  try {
    const record = await prisma.billingRecord.create({
      data: {
        elderId,
        month,
        baseFee,
        careFee,
        medicineFee,
        otherFee,
        total,
        status: 'UNPAID',
        organizationId: orgId,
      },
      include: { elder: true },
    })

    return Response.json({ record }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/billing]', error)
    return Response.json({ error: '创建账单失败' }, { status: 500 })
  }
}
