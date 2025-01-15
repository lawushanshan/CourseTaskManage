import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseForm } from '@/components/course/course-form'

interface Props {
  params: {
    role: string
    courseId: string
  }
}

export default async function EditCoursePage({ params }: Props) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  if (params.role !== 'teacher' || !session.user.roles.includes('TEACHER')) {
    redirect('/login')
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      teacherId: session.user.id,
    },
  })

  if (!course) {
    redirect('/courses/teacher')
  }

  return <CourseForm initialValues={course} mode="edit" />
} 