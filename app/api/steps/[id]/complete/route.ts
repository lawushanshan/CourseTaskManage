import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkTaskCompletion } from '@/lib/task-completion'
import { ApiResponse } from '@/types/api'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // 创建步骤完成记录
    await prisma.stepCompletion.create({
      data: {
        studentId: session.user.id,
        stepId: params.id,
      },
    })

    // 获取步骤所属的任务
    const step = await prisma.step.findUnique({
      where: { id: params.id },
      select: { taskId: true },
    })

    if (step) {
      // 检查任务是否完成
      await checkTaskCompletion(step.taskId, session.user.id)
    }

    return NextResponse.json<ApiResponse>({
      success: true,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 