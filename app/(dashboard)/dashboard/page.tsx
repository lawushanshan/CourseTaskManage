import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentCourses } from '@/components/dashboard/recent-courses'
import { LearningProgress } from '@/components/dashboard/learning-progress'

export const metadata: Metadata = {
  title: '个人仪表板 | EduFlow',
  description: '查看您的学习进度和最近课程',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const stats = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          enrolledCourses: true,
          completedSteps: true,
          comments: true,
        },
      },
    },
  })

  const recentCourses = await prisma.course.findMany({
    where: {
      students: {
        some: {
          id: session.user.id,
        },
      },
    },
    take: 5,
    orderBy: {
      enrollments: {
        _count: 'desc',
      },
    },
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
    },
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <DashboardStats stats={stats} />
        <div className="grid gap-6 md:grid-cols-2">
          <RecentCourses courses={recentCourses} />
          <LearningProgress userId={session.user.id} />
        </div>
      </div>
    </div>
  )
} 