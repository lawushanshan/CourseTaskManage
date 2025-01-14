import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseEditor } from '@/components/course/course-editor'

export const metadata: Metadata = {
  title: '编辑课程 | EduFlow',
  description: '编辑课程内容',
}

interface CourseEditPageProps {
  params: {
    id: string
  }
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user.roles.includes('TEACHER')) {
    redirect('/login')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      tasks: {
        include: {
          steps: true,
        },
        orderBy: {
          orderIndex: 'asc',
        },
      },
    },
  })

  if (!course) {
    redirect('/courses')
  }

  if (course.teacherId !== session.user.id) {
    redirect('/courses')
  }

  return (
    <div className="container max-w-5xl py-10">
      <CourseEditor course={course} />
    </div>
  )
} 