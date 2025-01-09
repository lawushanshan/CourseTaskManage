import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { StepManagement } from '@/components/admin/step-management'

export const metadata: Metadata = {
  title: '步骤管理 | EduFlow',
  description: '管理任务步骤',
}

interface StepsPageProps {
  params: {
    courseId: string
    taskId: string
  }
}

export default async function StepsPage({ params }: StepsPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
    include: {
      steps: {
        orderBy: {
          orderIndex: 'asc',
        },
      },
    },
  })

  if (!task) {
    redirect(`/admin/courses/${params.courseId}/tasks`)
  }

  return (
    <div className="container py-10">
      <StepManagement taskId={params.taskId} steps={task.steps} />
    </div>
  )
} 