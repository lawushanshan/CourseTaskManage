'use client'

import { useState } from 'react'
import { Card, Row, Col, Statistic, Progress, Table, Tabs } from 'antd'
import { Line, Pie } from '@ant-design/charts'
import { ClockCircleOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons'
import { useMediaQuery } from '@/hooks/use-media-query'

interface LearningAnalyticsProps {
  userId: string
  learningData: {
    totalTime: number
    completedTasks: number
    totalTasks: number
    dailyProgress: Array<{
      date: string
      minutes: number
      completedSteps: number
    }>
    categoryDistribution: Array<{
      category: string
      count: number
    }>
    performanceByLevel: Array<{
      level: string
      avgScore: number
      totalCourses: number
    }>
  }
}

export function LearningAnalytics({ learningData }: LearningAnalyticsProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {
    totalTime,
    completedTasks,
    totalTasks,
    dailyProgress,
    categoryDistribution,
    performanceByLevel,
  } = learningData

  const completionRate = (completedTasks / totalTasks) * 100

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="总学习时长"
              value={Math.round(totalTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="任务完成率"
              value={completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card>
            <Statistic
              title="已完成任务"
              value={completedTasks}
              suffix={`/ ${totalTasks}`}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {isMobile ? (
        <Tabs
          items={[
            {
              key: 'progress',
              label: '学习进度',
              children: (
                <Card>
                  <Line
                    data={dailyProgress}
                    xField="date"
                    yField="minutes"
                    seriesField="type"
                    annotations={[
                      {
                        type: 'regionFilter',
                        start: ['min', 'median'],
                        end: ['max', '0'],
                        color: '#F4664A',
                      },
                    ]}
                  />
                </Card>
              ),
            },
            {
              key: 'distribution',
              label: '课程分布',
              children: (
                <Card>
                  <Pie
                    data={categoryDistribution}
                    angleField="count"
                    colorField="category"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} {percentage}',
                    }}
                  />
                </Card>
              ),
            },
            {
              key: 'performance',
              label: '难度表现',
              children: (
                <Card>
                  <Table
                    dataSource={performanceByLevel}
                    columns={[
                      {
                        title: '难度',
                        dataIndex: 'level',
                        key: 'level',
                      },
                      {
                        title: '平均分',
                        dataIndex: 'avgScore',
                        key: 'avgScore',
                        render: (score) => (
                          <Progress
                            percent={score}
                            size="small"
                            status={score >= 80 ? 'success' : 'normal'}
                          />
                        ),
                      },
                      {
                        title: '课程数',
                        dataIndex: 'totalCourses',
                        key: 'totalCourses',
                      },
                    ]}
                    pagination={false}
                    scroll={{ x: true }}
                  />
                </Card>
              ),
            },
          ]}
        />
      ) : (
        <Card title="每日学习进度">
          <Line
            data={dailyProgress}
            xField="date"
            yField="minutes"
            seriesField="type"
            annotations={[
              {
                type: 'regionFilter',
                start: ['min', 'median'],
                end: ['max', '0'],
                color: '#F4664A',
              },
            ]}
          />
        </Card>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Card title="课程分类分布">
            <Pie
              data={categoryDistribution}
              angleField="count"
              colorField="category"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="不同难度表现">
            <Table
              dataSource={performanceByLevel}
              columns={[
                {
                  title: '难度',
                  dataIndex: 'level',
                  key: 'level',
                },
                {
                  title: '平均分',
                  dataIndex: 'avgScore',
                  key: 'avgScore',
                  render: (score) => (
                    <Progress
                      percent={score}
                      size="small"
                      status={score >= 80 ? 'success' : 'normal'}
                    />
                  ),
                },
                {
                  title: '课程数',
                  dataIndex: 'totalCourses',
                  key: 'totalCourses',
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
} 