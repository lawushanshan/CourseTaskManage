'use client'

import { Course } from '@/types'
import { useState } from 'react'
import { TaskList } from './task-list'
import { CourseProgress } from './course-progress'
import { CourseDiscussion } from './course-discussion'

interface CourseContentProps {
  course: Course
}

export function CourseContent({ course }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'discussion'>('tasks')

  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-8">
        <div className="flex items-center gap-4 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'tasks'
                ? 'border-b-2 border-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            任务列表
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'discussion'
                ? 'border-b-2 border-primary'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('discussion')}
          >
            讨论区
          </button>
        </div>
        {activeTab === 'tasks' ? (
          <TaskList tasks={course.tasks} />
        ) : (
          <CourseDiscussion courseId={course.id} />
        )}
      </div>
      <div className="md:col-span-4">
        <CourseProgress course={course} />
      </div>
    </div>
  )
} 