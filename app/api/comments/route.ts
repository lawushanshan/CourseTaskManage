import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { targetType, targetId, content, parentId, isPrivate } = body

    // 添加输入验证
    if (!content?.trim()) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '评论内容不能为空'
      }, { status: 400 })
    }

    if (!targetType || !targetId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '目标类型和ID不能为空'
      }, { status: 400 })
    }

    // 验证目标是否存在
    const target = await prisma[targetType.toLowerCase()].findUnique({
      where: { id: targetId }
    })

    if (!target) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '目标不存在'
      }, { status: 404 })
    }

    // 如果是回复，验证父评论是否存在
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: '父评论不存在'
        }, { status: 404 })
      }
    }

    // 检查是否有权限发布私密讨论
    if (isPrivate && !session.user.roles.some(role => ['TEACHER', 'ADMIN'].includes(role))) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '没有权限发布私密讨论'
      }, { status: 403 })
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        targetType,
        targetId,
        content,
        parentId,
        isPrivate,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            roles: true,
          },
        },
      },
    })

    // 如果是回复，发送通知给原评论作者
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { userId: true },
      })

      if (parentComment && parentComment.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            type: 'COMMENT',
            title: '收到新回复',
            content: `${session.user.name} 回复了你的评论`,
            data: {
              commentId: comment.id,
              targetType,
              targetId,
            },
          },
        })
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: comment
    })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetType = searchParams.get('targetType')
    const targetId = searchParams.get('targetId')
    const parentId = searchParams.get('parentId')

    const session = await getServerSession(authOptions)
    const isTeacherOrAdmin = session?.user?.roles?.some(
      role => ['TEACHER', 'ADMIN'].includes(role)
    )

    const comments = await prisma.comment.findMany({
      where: {
        targetType: targetType as string,
        targetId,
        parentId,
        // 非教师/管理员只能看到公开讨论
        ...(!isTeacherOrAdmin && {
          isPrivate: false,
        }),
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            roles: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                roles: true,
              },
            },
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 