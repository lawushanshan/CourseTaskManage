import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TaskManagement } from '@/components/admin/task-management'

export const metadata: Metadata = {
  title: '任务管理 | EduFlow',
  description: '管理课程任务',
}

interface TasksPageProps {
  params: {
    courseId: string
  }
}

export default async function TasksPage({ params }: TasksPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      tasks: {
        include: {
          steps: true,
          _count: {
            select: {
              completedBy: true,
            },
          },
        },
        orderBy: {
          orderIndex: 'asc',
        },
      },
    },
  })

  if (!course) {
    redirect('/admin/courses')
  }

  return (
    <div className="container py-10">
      <TaskManagement courseId={params.courseId} tasks={course.tasks} />
    </div>
  )
} 