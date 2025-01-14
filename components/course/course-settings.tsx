'use client'

import { Form, Input, Select, Button, Card, message, Space } from 'antd'
import { useState } from 'react'

interface CourseSettingsProps {
  course: {
    id: string
    status: string
    price?: number
    level?: string
  }
}

export function CourseSettings({ course }: CourseSettingsProps) {
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${course.id}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('更新设置失败')
      }

      message.success('课程设置已更新')
    } catch (error) {
      message.error('更新设置失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="课程设置">
      <Form
        layout="vertical"
        initialValues={course}
        onFinish={onFinish}
      >
        <Form.Item
          name="status"
          label="课程状态"
          rules={[{ required: true, message: '请选择课程状态' }]}
        >
          <Select>
            <Select.Option value="DRAFT">草稿</Select.Option>
            <Select.Option value="PUBLISHED">已发布</Select.Option>
            <Select.Option value="ARCHIVED">已归档</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="level"
          label="难度等级"
        >
          <Select>
            <Select.Option value="BEGINNER">入门</Select.Option>
            <Select.Option value="INTERMEDIATE">进阶</Select.Option>
            <Select.Option value="ADVANCED">高级</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="课程价格"
        >
          <Input type="number" prefix="¥" min={0} step={0.01} />
        </Form.Item>

        <Form.Item className="mb-0">
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
            {course.status === 'DRAFT' && (
              <Button type="primary">
                发布课程
              </Button>
            )}
            {course.status === 'PUBLISHED' && (
              <Button danger>
                下架课程
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
} 