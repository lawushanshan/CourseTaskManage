'use client'

import { Form, Input, Button, Select } from 'antd'
import { useEffect } from 'react'
import type { Course } from '@/types'

const { TextArea } = Input

interface CourseFormProps {
  initialData?: Course | null
  onSubmit: (data: Partial<Course>) => Promise<void>
  loading?: boolean
}

export function CourseForm({ initialData, onSubmit, loading }: CourseFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData)
    }
  }, [form, initialData])

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialData || {}}
    >
      <Form.Item
        name="title"
        label="课程名称"
        rules={[{ required: true, message: '请输入课程名称' }]}
      >
        <Input placeholder="请输入课程名称" />
      </Form.Item>

      <Form.Item
        name="description"
        label="课程描述"
        rules={[{ required: true, message: '请输入课程描述' }]}
      >
        <TextArea rows={4} placeholder="请输入课程描述" />
      </Form.Item>

      <Form.Item
        name="level"
        label="课程难度"
        rules={[{ required: true, message: '请选择课程难度' }]}
      >
        <Select>
          <Select.Option value="BEGINNER">初级</Select.Option>
          <Select.Option value="INTERMEDIATE">中级</Select.Option>
          <Select.Option value="ADVANCED">高级</Select.Option>
        </Select>
      </Form.Item>

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

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialData ? '更新课程' : '创建课程'}
        </Button>
      </Form.Item>
    </Form>
  )
} 