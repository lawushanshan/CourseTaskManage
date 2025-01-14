import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseManagement } from '@/components/admin/course-management'

export const metadata: Metadata = {
  title: '课程管理 | EduFlow',
  description: '管理所有课程',
}

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const courses = await prisma.course.findMany({
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
          tasks: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container py-10">
      <CourseManagement courses={courses} />
    </div>
  )
} 