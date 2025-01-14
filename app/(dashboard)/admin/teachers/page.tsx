import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { TeacherManagement } from '@/components/admin/teacher-management'

export const metadata: Metadata = {
  title: '教师管理 | EduFlow',
  description: '管理教师信息和课程分配',
}

export default async function TeachersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const teachers = await prisma.user.findMany({
    where: {
      roles: {
        has: 'TEACHER'
      }
    },
    include: {
      teachingCourses: {
        select: {
          id: true,
          title: true,
          status: true,
          _count: {
            select: {
              students: true,
            }
          }
        }
      },
      _count: {
        select: {
          teachingCourses: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      title: true,
      teacherId: true,
    }
  })

  return (
    <div className="container py-10">
      <TeacherManagement teachers={teachers} courses={courses} />
    </div>
  )
} 