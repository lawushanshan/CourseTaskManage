'use client'

import { Course } from '@/types'
import { Card, Button, Space, Typography } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const { Text, Title } = Typography

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter()

  return (
    <Card hoverable>
      <div className="space-y-4">
        <div>
          <Title level={4}>{course.title}</Title>
          <Text type="secondary" ellipsis={{ rows: 2 }}>
            {course.description}
          </Text>
        </div>
        <div>
          <Text type="secondary">讲师：{course.teacher.name}</Text>
          <Space className="mt-4" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button type="link" onClick={() => router.push(`/courses/${course.id}`)}>
              查看详情
            </Button>
            <Link href={`/courses/${course.id}/learn`} passHref>
              <Button type="primary">开始学习</Button>
            </Link>
          </Space>
        </div>
      </div>
    </Card>
  )
} 