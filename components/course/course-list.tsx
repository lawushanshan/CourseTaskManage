'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { List, Card } from 'antd'
import { CourseCard } from './course-card'

interface CourseListProps {
  courses: any[]
}

export function CourseList({ courses }: CourseListProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={courses}
      renderItem={(course) => (
        <List.Item>
          <CourseCard course={course} />
        </List.Item>
      )}
      pagination={
        isMobile
          ? {
              simple: true,
              pageSize: 6,
            }
          : {
              pageSize: 12,
              showSizeChanger: true,
              showQuickJumper: true,
            }
      }
    />
  )
} 