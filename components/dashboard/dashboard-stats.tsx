'use client'

import { Card, Row, Col, Statistic } from 'antd'
import { BookOutlined, CheckCircleOutlined, CommentOutlined } from '@ant-design/icons'

interface DashboardStatsProps {
  stats: {
    _count: {
      enrolledCourses: number
      completedSteps: number
      comments: number
    }
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="已报名课程"
            value={stats._count.enrolledCourses}
            prefix={<BookOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="已完成步骤"
            value={stats._count.completedSteps}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="评论数量"
            value={stats._count.comments}
            prefix={<CommentOutlined />}
          />
        </Card>
      </Col>
    </Row>
  )
} 