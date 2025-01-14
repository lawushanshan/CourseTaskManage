'use client'

import { Card, Row, Col, Statistic, Table, Progress } from 'antd'
import { UserOutlined, BookOutlined, TeamOutlined, CheckOutlined } from '@ant-design/icons'
import type { Course } from '@/types'

interface StatisticsProps {
  basicStats: {
    userCount: number
    courseCount: number
    teacherCount: number
    studentCount: number
    taskCount: number
    completionCount: number
  }
  activeCourses: (Course & {
    _count: {
      students: number
      tasks: number
    }
    teacher: {
      name: string
    }
  })[]
  progressStats: {
    status: string
    _count: number
  }[]
}

export function Statistics({ basicStats, activeCourses, progressStats }: StatisticsProps) {
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '教师',
      dataIndex: ['teacher', 'name'],
      key: 'teacher',
    },
    {
      title: '学生数',
      dataIndex: ['_count', 'students'],
      key: 'students',
    },
    {
      title: '任务数',
      dataIndex: ['_count', 'tasks'],
      key: 'tasks',
    },
  ]

  const totalProgress = progressStats.reduce((acc, curr) => acc + curr._count, 0)

  return (
    <div className="space-y-8">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={basicStats.userCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总课程数"
              value={basicStats.courseCount}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="教师数"
              value={basicStats.teacherCount}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="任务完成数"
              value={basicStats.completionCount}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最活跃课程">
        <Table
          columns={columns}
          dataSource={activeCourses}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="学习进度统计">
        <div className="space-y-4">
          {progressStats.map(stat => (
            <div key={stat.status}>
              <div className="flex justify-between mb-2">
                <span>{stat.status === 'IN_PROGRESS' ? '进行中' : '已完成'}</span>
                <span>{Math.round((stat._count / totalProgress) * 100)}%</span>
              </div>
              <Progress
                percent={Math.round((stat._count / totalProgress) * 100)}
                showInfo={false}
                status={stat.status === 'COMPLETED' ? 'success' : 'active'}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 