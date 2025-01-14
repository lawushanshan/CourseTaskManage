'use client'

import { Card, Progress, List } from 'antd'
import { useEffect, useState } from 'react'
import { Course } from '@/types'

interface LearningProgressProps {
  userId: string
}

export function LearningProgress({ userId }: LearningProgressProps) {
  const [courses, setCourses] = useState<(Course & { progress: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch(`/api/users/${userId}/progress`)
        const data = await response.json()
        if (data.success) {
          setCourses(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  return (
    <Card title="学习进度" loading={loading}>
      <List
        dataSource={courses}
        renderItem={(course) => (
          <List.Item>
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span>{course.title}</span>
                <span>{course.progress}%</span>
              </div>
              <Progress percent={course.progress} size="small" />
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
} 