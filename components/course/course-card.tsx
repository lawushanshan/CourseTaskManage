'use client'

import { Course } from '@/types'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter()

  return (
    <div className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold leading-none tracking-tight">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>讲师：{course.teacher.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              查看详情
            </Button>
            <Link
              href={`/courses/${course.id}/learn`}
              className={Button({ variant: "default", size: "sm" })}
            >
              开始学习
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 