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
    
    // 验证课程所有权
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    })

    if (!course || course.teacherId !== session.user.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex,
        courseId: data.courseId,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Create task error:', error)
    return NextResponse.json(
      { error: '创建任务失败' },
      { status: 500 }
    )
  }
} 