import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseHeader } from '@/components/course/course-header'
import { CourseContent } from '@/components/course/course-content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface CoursePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  })

  if (!course) {
    return {
      title: '课程未找到',
    }
  }

  return {
    title: `${course.title} | EduFlow`,
    description: course.description,
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    notFound()
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      teacher: true,
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
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <CourseHeader course={course} />
        <CourseContent course={course} />
      </div>
    </div>
  )
} 