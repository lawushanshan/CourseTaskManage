import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'
import type { UserRole } from '@/types'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.isAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { roles } = body as { roles: UserRole[] }

    // 验证角色数组
    if (!roles.length) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '用户必须至少有一个角色'
      }, { status: 400 })
    }

    // 防止删除最后一个管理员
    if (params.id === session.user.id && !roles.includes('ADMIN')) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '不能删除自己的管理员角色'
      }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { roles },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: user
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 