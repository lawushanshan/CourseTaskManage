'use client'

import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Tabs, DatePicker } from 'antd'
import { Line } from '@ant-design/charts'
import type { SystemMetrics } from '@/lib/monitoring'

interface MonitoringDashboardProps {
  currentMetrics: SystemMetrics
  recentMetrics: any[]
  recentLogs: any[]
}

export function MonitoringDashboard({
  currentMetrics,
  recentMetrics,
  recentLogs,
}: MonitoringDashboardProps) {
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null)

  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={
          level === 'error' ? 'red' :
          level === 'warn' ? 'orange' :
          'green'
        }>
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '用户',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
  ]

  const memoryData = recentMetrics.map(metric => ({
    timestamp: new Date(metric.timestamp).toLocaleString(),
    value: metric.metrics.memory.used / 1024 / 1024,
    type: '内存使用(MB)',
  }))

  const cpuData = recentMetrics.map(metric => ({
    timestamp: new Date(metric.timestamp).toLocaleString(),
    value: metric.metrics.cpu.loadAvg[0],
    type: 'CPU负载',
  }))

  return (
    <div className="space-y-8">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="内存使用"
              value={currentMetrics.memory.used / 1024 / 1024}
              suffix="MB"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="CPU负载"
              value={currentMetrics.cpu.loadAvg[0]}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总请求数"
              value={currentMetrics.requests.total}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="请求成功率"
              value={currentMetrics.requests.success / currentMetrics.requests.total * 100}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'metrics',
            label: '性能指标',
            children: (
              <div className="space-y-8">
                <Card title="内存使用趋势">
                  <Line
                    data={memoryData}
                    xField="timestamp"
                    yField="value"
                    seriesField="type"
                  />
                </Card>
                <Card title="CPU负载趋势">
                  <Line
                    data={cpuData}
                    xField="timestamp"
                    yField="value"
                    seriesField="type"
                  />
                </Card>
              </div>
            ),
          },
          {
            key: 'logs',
            label: '系统日志',
            children: (
              <Card
                title="系统日志"
                extra={
                  <DatePicker.RangePicker
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange([dates[0].toDate(), dates[1].toDate()])
                      } else {
                        setDateRange(null)
                      }
                    }}
                  />
                }
              >
                <Table
                  columns={logColumns}
                  dataSource={recentLogs.filter(log => {
                    if (!dateRange) return true
                    const logDate = new Date(log.timestamp)
                    return logDate >= dateRange[0] && logDate <= dateRange[1]
                  })}
                  rowKey="id"
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
} 