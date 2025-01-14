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
    
    // 验证任务所有权
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
    })

    if (!task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 })
    }

    const course = await prisma.course.findUnique({
      where: { id: task.courseId },
    })

    if (!course || course.teacherId !== session.user.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const step = await prisma.step.create({
      data: {
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex,
        taskId: data.taskId,
      },
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Create step error:', error)
    return NextResponse.json(
      { error: '创建步骤失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.roles.includes('TEACHER')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const stepId = searchParams.get('id')

    if (!stepId) {
      return NextResponse.json({ error: '步骤ID缺失' }, { status: 400 })
    }

    const step = await prisma.step.findUnique({
      where: { id: stepId },
    })

    if (!step) {
      return NextResponse.json({ error: '步骤不存在' }, { status: 404 })
    }

    const task = await prisma.task.findUnique({
      where: { id: step.taskId },
    })

    if (!task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 })
    }

    const course = await prisma.course.findUnique({
      where: { id: task.courseId },
    })

    if (!course || course.teacherId !== session.user.id) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    await prisma.step.delete({
      where: { id: stepId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete step error:', error)
    return NextResponse.json(
      { error: '删除步骤失败' },
      { status: 500 }
    )
  }
} 