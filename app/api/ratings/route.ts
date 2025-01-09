import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { targetType, targetId, score, review } = body

    // 检查是否已经评分
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    })

    if (existingRating) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '您已经评价过了'
      }, { status: 400 })
    }

    const rating = await prisma.rating.create({
      data: {
        score,
        review,
        targetType,
        targetId,
        userId: session.user.id,
        ...(targetType === 'COURSE' && { courseId: targetId }),
        ...(targetType === 'TASK' && { taskId: targetId }),
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: rating
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 