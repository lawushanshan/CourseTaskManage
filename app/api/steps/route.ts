import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.isAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, title, content, contentType, orderIndex, resources } = body

    const step = await prisma.step.create({
      data: {
        title,
        content,
        contentType,
        orderIndex,
        resources,
        taskId,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: step
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 