import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orgId = (session.user as any).organizationId
  const orders = await prisma.purchaseOrder.findMany({
    where: { organizationId: orgId },
    include: { supplier: true, items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

const VALID_STATUS = ['PENDING', 'APPROVED', 'DELIVERED', 'CANCELLED']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role
  if (!['ORG_ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const orgId = (session.user as any).organizationId
  const body = await req.json()

  if (!body.supplierId || typeof body.supplierId !== 'string') {
    return NextResponse.json({ error: '请选择供应商' }, { status: 400 })
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: '请至少添加一项采购明细' }, { status: 400 })
  }
  if (body.status && !VALID_STATUS.includes(body.status)) {
    return NextResponse.json({ error: '无效的订单状态' }, { status: 400 })
  }

  // 验证供应商属于本机构
  const supplier = await prisma.supplier.findFirst({
    where: { id: body.supplierId, organizationId: orgId },
  })
  if (!supplier) {
    return NextResponse.json({ error: '供应商不存在或无权访问' }, { status: 404 })
  }

  // 计算明细与总额
  const items = body.items.map((it: any) => {
    const quantity = Number(it.quantity) || 0
    const unitPrice = Number(it.unitPrice) || 0
    return {
      itemName: String(it.itemName || ''),
      unit: String(it.unit || ''),
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
    }
  })
  const totalAmount = items.reduce((sum: number, it: any) => sum + it.totalPrice, 0)

  // 生成订单号
  const count = await prisma.purchaseOrder.count({ where: { organizationId: orgId } })
  const orderNo = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

  const order = await prisma.purchaseOrder.create({
    data: {
      orderNo,
      supplierId: body.supplierId,
      organizationId: orgId,
      status: body.status || 'PENDING',
      totalAmount,
      expectedDate: body.expectedDate ? new Date(body.expectedDate) : null,
      notes: body.notes ? String(body.notes) : null,
      items: { create: items },
    },
    include: { supplier: true, items: true },
  })

  return NextResponse.json(order, { status: 201 })
}
