import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH /api/billing/[id]
// Body: { status: 'PAID' | 'UNPAID' | 'OVERDUE' }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return Response.json({ error: '权限不足，仅管理员可修改账单状态' }, { status: 403 })
  }

  const { id } = await params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: '请求体格式错误' }, { status: 400 })
  }

  const { status } = body
  const allowedStatuses = ['PAID', 'UNPAID', 'OVERDUE']
  if (!status || !allowedStatuses.includes(status)) {
    return Response.json(
      { error: `status 值无效，允许值：${allowedStatuses.join('、')}` },
      { status: 400 }
    )
  }

  // Verify record exists and belongs to this organization
  const existing = await prisma.billingRecord.findFirst({
    where: { id, organizationId: orgId },
  })
  if (!existing) {
    return Response.json({ error: '账单不存在或无权操作' }, { status: 404 })
  }

  try {
    const updated = await prisma.billingRecord.update({
      where: { id },
      data: {
        status,
        // Set paidAt when marking as paid, clear it otherwise
        paidAt: status === 'PAID' ? new Date() : null,
      },
      include: { elder: true },
    })

    return Response.json({ record: updated })
  } catch (error) {
    console.error('[PATCH /api/billing/[id]]', error)
    return Response.json({ error: '更新账单状态失败' }, { status: 500 })
  }
}
