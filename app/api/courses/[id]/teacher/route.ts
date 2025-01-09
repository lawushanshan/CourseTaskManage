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
    const { teacherId } = body

    // 验证教师身份
    const teacher = await prisma.user.findUnique({
      where: { 
        id: teacherId,
        roles: {
          has: 'TEACHER'
        }
      },
    })

    if (!teacher) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '指定的教师不存在'
      }, { status: 400 })
    }

    const course = await prisma.course.update({
      where: { id: params.id },
      data: { teacherId },
      include: {
        _count: {
          select: {
            students: true,
          }
        }
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: course
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 