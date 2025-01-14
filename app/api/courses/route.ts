import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.roles.includes('TEACHER')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const data = await request.json()
    
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        learningObjectives: data.learningObjectives,
        prerequisites: data.prerequisites,
        status: 'DRAFT',
        teacherId: session.user.id,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: '创建课程失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const teacherId = searchParams.get('teacher')
    const query = searchParams.get('q')

    const where = {
      status: 'PUBLISHED',
      ...(category && { category }),
      ...(level && { level }),
      ...(teacherId && { teacherId }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: '获取课程列表失败' },
      { status: 500 }
    )
  }
} 