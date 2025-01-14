'use client'

import { useState } from 'react'
import { Tabs, Button, message } from 'antd'
import { CourseForm } from './course-form'
import { TaskList } from './task-list'
import { CourseSettings } from './course-settings'

interface CourseEditorProps {
  course: any // 稍后添加具体类型
}

export function CourseEditor({ course }: CourseEditorProps) {
  const [activeKey, setActiveKey] = useState('basic')

  const items = [
    {
      key: 'basic',
      label: '基本信息',
      children: <CourseForm course={course} />,
    },
    {
      key: 'tasks',
      label: '任务管理',
      children: <TaskList courseId={course.id} initialTasks={course.tasks} />,
    },
    {
      key: 'settings',
      label: '课程设置',
      children: <CourseSettings course={course} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">编辑课程</h1>
        <Button type="primary">发布课程</Button>
      </div>
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={setActiveKey}
      />
    </div>
  )
} 