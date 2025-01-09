'use client'

import { Card, List, Avatar } from 'antd'
import { Course } from '@/types'
import Link from 'next/link'

interface RecentCoursesProps {
  courses: Course[]
}

export function RecentCourses({ courses }: RecentCoursesProps) {
  return (
    <Card title="最近课程">
      <List
        itemLayout="horizontal"
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={course.coverImage || '/course-placeholder.png'} />}
              title={
                <Link href={`/courses/${course.id}`} className="hover:underline">
                  {course.title}
                </Link>
              }
              description={`讲师: ${course.teacher.name}`}
            />
          </List.Item>
        )}
      />
    </Card>
  )
} 