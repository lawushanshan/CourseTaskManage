'use client'

import { Form, Input, InputNumber, Button } from 'antd'
import { useEffect } from 'react'
import type { Task } from '@/types'

const { TextArea } = Input

interface TaskFormProps {
  courseId: string
  initialData?: Task | null
  onSubmit: (data: Partial<Task>) => Promise<void>
  loading?: boolean
}

export function TaskForm({ courseId, initialData, onSubmit, loading }: TaskFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData)
    }
  }, [form, initialData])

  const handleSubmit = async (values: any) => {
    await onSubmit({
      ...values,
      courseId,
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialData || { orderIndex: 1 }}
    >
      <Form.Item
        name="title"
        label="任务名称"
        rules={[{ required: true, message: '请输入任务名称' }]}
      >
        <Input placeholder="请输入任务名称" />
      </Form.Item>

      <Form.Item
        name="description"
        label="任务描述"
        rules={[{ required: true, message: '请输入任务描述' }]}
      >
        <TextArea rows={4} placeholder="请输入任务描述" />
      </Form.Item>

      <Form.Item
        name="orderIndex"
        label="排序序号"
        rules={[{ required: true, message: '请输入排序序号' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialData ? '更新任务' : '创建任务'}
        </Button>
      </Form.Item>
    </Form>
  )
} 