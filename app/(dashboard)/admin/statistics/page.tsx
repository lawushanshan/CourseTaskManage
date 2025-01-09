import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Statistics } from '@/components/admin/statistics'

export const metadata: Metadata = {
  title: '数据统计 | EduFlow',
  description: '系统数据统计和分析',
}

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  // 获取基础统计数据
  const [
    userCount,
    courseCount,
    teacherCount,
    studentCount,
    taskCount,
    completionCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.user.count({
      where: {
        roles: {
          has: 'TEACHER'
        }
      }
    }),
    prisma.user.count({
      where: {
        roles: {
          has: 'STUDENT'
        }
      }
    }),
    prisma.task.count(),
    prisma.step.count({
      where: {
        completions: {
          some: {}
        }
      }
    })
  ])

  // 获取最活跃的课程
  const activeCourses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED'
    },
    include: {
      _count: {
        select: {
          students: true,
          tasks: true,
        }
      },
      teacher: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      students: {
        _count: 'desc'
      }
    },
    take: 5
  })

  // 获取学习进度统计
  const progressStats = await prisma.studentCourse.groupBy({
    by: ['status'],
    _count: true,
  })

  return (
    <div className="container py-10">
      <Statistics
        basicStats={{
          userCount,
          courseCount,
          teacherCount,
          studentCount,
          taskCount,
          completionCount
        }}
        activeCourses={activeCourses}
        progressStats={progressStats}
      />
    </div>
  )
} 