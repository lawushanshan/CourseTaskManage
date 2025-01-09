'use client'

import { Progress, Card, Typography } from 'antd'
import { Course } from '@/types'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface CourseProgressProps {
  course: Course
  completedSteps: number
  totalSteps: number
}

export function CourseProgress({ course, completedSteps, totalSteps }: CourseProgressProps) {
  const progress = Math.round((completedSteps / totalSteps) * 100) || 0

  return (
    <Card>
      <Title level={5}>学习进度</Title>
      <div className="mt-4">
        <Progress
          type="circle"
          percent={progress}
          format={(percent) => (
            <div className="text-center">
              <div className="text-lg font-bold">{percent}%</div>
              <Text type="secondary" className="text-sm">
                已完成
              </Text>
            </div>
          )}
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <Text>已完成步骤</Text>
          <Text strong>{completedSteps}</Text>
        </div>
        <div className="flex justify-between">
          <Text>总步骤数</Text>
          <Text strong>{totalSteps}</Text>
        </div>
      </div>
      {progress === 100 && (
        <div className="mt-4 flex items-center text-green-500">
          <CheckCircleOutlined className="mr-2" />
          <Text type="success">恭喜你完成了本课程！</Text>
        </div>
      )}
    </Card>
  )
} 