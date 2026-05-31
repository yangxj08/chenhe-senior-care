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

  if (userRole !== 'FAMILY') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  try {
    const elder = await prisma.elder.findFirst({
      where: { familyUserId: userId },
      include: {
        careRecords: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            nurse: { select: { id: true, name: true } },
          },
        },
        billings: {
          orderBy: { createdAt: 'desc' },
          take: 12,
        },
        organization: {
          select: { id: true, name: true, phone: true, address: true },
        },
      },
    })

    if (!elder) {
      return NextResponse.json({ elder: null, message: '未找到关联家人信息' })
    }

    return NextResponse.json({ elder })
  } catch (error) {
    console.error('GET /api/family/elder error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
