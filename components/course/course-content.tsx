'use client'

import { Course } from '@/types'
import { useState } from 'react'
import { Tabs, Card } from 'antd'
import { TaskList } from './task-list'
import { CourseProgress } from './course-progress'
import { CourseDiscussion } from './course-discussion'

interface CourseContentProps {
  course: Course
}

export function CourseContent({ course }: CourseContentProps) {
  const items = [
    {
      key: 'tasks',
      label: '任务列表',
      children: <TaskList tasks={course.tasks} />,
    },
    {
      key: 'discussion',
      label: '讨论区',
      children: <CourseDiscussion courseId={course.id} />,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-12">
      <div className="md:col-span-8">
        <Card>
          <Tabs items={items} />
        </Card>
      </div>
      <div className="md:col-span-4">
        <CourseProgress course={course} />
      </div>
    </div>
  )
} 