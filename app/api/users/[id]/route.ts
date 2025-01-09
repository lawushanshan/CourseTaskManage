import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

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
    const { name, email, role, isActive } = body

    // 检查邮箱是否已被其他用户使用
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: params.id,
        },
      },
    })

    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '该邮箱已被其他用户使用'
      }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        role,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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

export async function DELETE(
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

    // 防止删除自己
    if (session.user.id === params.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '不能删除自己的账号'
      }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: null
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 