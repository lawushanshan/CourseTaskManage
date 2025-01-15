import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CourseForm } from '@/components/course/course-form'

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.roles?.includes('TEACHER')) {
    redirect('/login')
  }
  
  return <CourseForm />
} 