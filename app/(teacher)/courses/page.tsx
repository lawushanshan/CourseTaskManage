import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseList } from '@/components/course/course-list'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.roles?.includes('TEACHER')) {
    redirect('/login')
  }

  const courses = await prisma.course.findMany({
    where: {
      teacherId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <CourseList courses={courses} />
} 