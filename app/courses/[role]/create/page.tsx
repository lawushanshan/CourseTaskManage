'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CourseForm } from '@/components/course/course-form'

export default function CreateCoursePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    
    if (session && !session.user.roles.includes('TEACHER')) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || !session.user.roles.includes('TEACHER')) {
    return null
  }

  return <CourseForm />
} 