import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ApiResponse } from '@/types/api'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            students: true,
            ratings: true
          }
        }
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: courses
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'TEACHER') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const course = await prisma.course.create({
      data: {
        ...body,
        teacherId: session.user.id
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