import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CourseList } from '@/components/course/course-list'
import { prisma } from '@/lib/prisma'

interface Props {
  params: {
    role: string
  }
}

export default async function CoursesPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  switch (params.role) {
    case 'teacher':
      if (!session.user.roles.includes('TEACHER')) {
        redirect('/login')
      }
      const teacherCourses = await prisma.course.findMany({
        where: {
          teacherId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return <CourseList courses={teacherCourses} />
      
    default:
      const studentCourses = await prisma.course.findMany({
        where: {
          students: {
            some: {
              id: session.user.id
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return <CourseList courses={studentCourses} />
  }
} 