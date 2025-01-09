'use client'

import { Course } from '@/types'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface CourseHeaderProps {
  course?: Course
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const router = useRouter()

  if (!course) return null

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleShare}>
          分享课程
        </Button>
        <Button onClick={() => router.push(`/courses/${course.id}/learn`)}>
          开始学习
        </Button>
      </div>
    </div>
  )
} 