import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Fail closed: never run without a configured secret
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET 环境变量未设置，拒绝启动')
}

// 用于在用户不存在时也执行一次 bcrypt 比对，消除时间侧信道
const DUMMY_HASH = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8DvElVjQU7vFkN7nGiM0lLgGqMUWZ6'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        })

        // 始终执行一次 bcrypt 比对（用户不存在时对 dummy hash 比对），
        // 防止用户枚举与时间侧信道攻击；统一返回模糊错误信息
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user?.password ?? DUMMY_HASH
        )

        if (!user || !isPasswordValid) {
          throw new Error('邮箱或密码错误')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization?.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organizationId = (user as any).organizationId
        token.organizationName = (user as any).organizationName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub
        ;(session.user as any).role = token.role
        ;(session.user as any).organizationId = token.organizationId
        ;(session.user as any).organizationName = token.organizationName
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
