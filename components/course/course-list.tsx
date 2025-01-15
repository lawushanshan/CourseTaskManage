'use client'

import { Course } from '@prisma/client'
import { Button, Card, List } from 'antd'
import Link from 'next/link'

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">我的课程</h1>
        <Link href="/courses/teacher/create">
          <Button type="primary">创建课程</Button>
        </Link>
      </div>
      
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <Card title={course.title}>
              <p>{course.description}</p>
              <div className="mt-4">
                <Link href={`/courses/teacher/${course.id}/edit`}>
                  <Button>编辑课程</Button>
                </Link>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
} 