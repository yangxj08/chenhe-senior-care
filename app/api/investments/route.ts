import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const userId = (session.user as any).id
  const userRole = (session.user as any).role

  if (userRole !== 'INVESTOR') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  try {
    const investments = await prisma.investment.findMany({
      where: { investorId: userId },
      include: {
        organization: {
          select: { id: true, name: true, address: true, phone: true },
        },
        returns: {
          orderBy: { month: 'desc' },
          take: 12,
        },
      },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json({ investments })
  } catch (error) {
    console.error('GET /api/investments error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
