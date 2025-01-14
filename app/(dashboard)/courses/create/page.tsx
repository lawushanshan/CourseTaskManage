import { Metadata } from 'next'
import { CourseForm } from '@/components/course/course-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '创建课程 | EduFlow',
  description: '创建新课程',
}

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user.roles.includes('TEACHER')) {
    redirect('/login')
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-2xl font-bold mb-8">创建新课程</h1>
      <CourseForm />
    </div>
  )
} 