import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CourseForm } from '@/components/course/course-form'

interface Props {
  params: {
    role: string
  }
}

export default async function CreateCoursePage({ params }: Props) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  if (params.role !== 'teacher' || !session.user.roles.includes('TEACHER')) {
    redirect('/login')
  }
  
  return <CourseForm />
} 