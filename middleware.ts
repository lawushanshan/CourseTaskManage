import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { Role } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 如果用户未登录，只允许访问公开页面
    if (!token) {
      if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      return NextResponse.next()
    }

    // 检查用户是否被禁用
    if (!token.isActive) {
      return NextResponse.redirect(new URL('/account-disabled', req.url))
    }

    // 管理员路由权限检查
    if (path.startsWith('/admin')) {
      if (!token.roles.includes(Role.ADMIN)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    // 教师路由权限检查
    if (path.startsWith('/teacher')) {
      if (!token.roles.includes(Role.TEACHER)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/api/:path*',
  ],
} 