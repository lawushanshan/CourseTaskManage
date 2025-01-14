'use client'

import { useState } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import { useRouter } from 'next/navigation'
import { MDEditor } from '@/components/shared/md-editor'

interface CourseFormData {
  title: string
  description: string
  category: string
  level: string
  learningObjectives: string
  prerequisites: string
}

export function CourseForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = async (values: CourseFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('创建课程失败')
      }

      const data = await response.json()
      message.success('课程创建成功！')
      router.push(`/courses/${data.id}/edit`)
    } catch (error) {
      message.error('创建课程失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      className="space-y-6"
    >
      <Form.Item
        name="title"
        label="课程标题"
        rules={[{ required: true, message: '请输入课程标题' }]}
      >
        <Input placeholder="输入课程标题" />
      </Form.Item>

      <Form.Item
        name="description"
        label="课程简介"
        rules={[{ required: true, message: '请输入课程简介' }]}
      >
        <Input.TextArea rows={4} placeholder="简要描述课程内容" />
      </Form.Item>

      <Form.Item
        name="category"
        label="课程分类"
        rules={[{ required: true, message: '请选择课程分类' }]}
      >
        <Select placeholder="选择课程分类">
          <Select.Option value="frontend">前端开发</Select.Option>
          <Select.Option value="backend">后端开发</Select.Option>
          <Select.Option value="mobile">移动开发</Select.Option>
          <Select.Option value="devops">DevOps</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="level"
        label="难度等级"
        rules={[{ required: true, message: '请选择难度等级' }]}
      >
        <Select placeholder="选择难度等级">
          <Select.Option value="BEGINNER">入门</Select.Option>
          <Select.Option value="INTERMEDIATE">进阶</Select.Option>
          <Select.Option value="ADVANCED">高级</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="learningObjectives"
        label="学习目标"
        rules={[{ required: true, message: '请输入学习目标' }]}
      >
        <MDEditor placeholder="通过本课程你将学习到什么？" />
      </Form.Item>

      <Form.Item
        name="prerequisites"
        label="预备知识"
      >
        <MDEditor placeholder="学习本课程需要哪些基础知识？" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          创建课程
        </Button>
      </Form.Item>
    </Form>
  )
} 