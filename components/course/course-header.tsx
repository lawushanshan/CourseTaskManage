'use client'

import { Course } from '@/types'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'

interface CourseHeaderProps {
  course: Course
  isEnrolled?: boolean
  isTeacher?: boolean
}

export function CourseHeader({ course, isEnrolled, isTeacher }: CourseHeaderProps) {
  const router = useRouter()

  const handleEnroll = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('加入课程失败')
      }

      router.refresh()
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  return (
    <div className="bg-white border-b">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <div>
            {isTeacher ? (
              <Button 
                type="primary"
                onClick={() => router.push(`/courses/${course.id}/edit`)}
              >
                编辑课程
              </Button>
            ) : !isEnrolled ? (
              <Button 
                type="primary"
                onClick={handleEnroll}
              >
                加入课程
              </Button>
            ) : (
              <Button 
                type="default"
                onClick={() => router.push(`/courses/${course.id}/learn`)}
              >
                继续学习
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 