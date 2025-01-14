'use client'

import { Form, Input, InputNumber, Select, Button, Upload } from 'antd'
import { useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import type { Step } from '@/types'

const { TextArea } = Input

interface StepFormProps {
  taskId: string
  initialData?: Step | null
  onSubmit: (data: Partial<Step>) => Promise<void>
  loading?: boolean
}

export function StepForm({ taskId, initialData, onSubmit, loading }: StepFormProps) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData)
    }
  }, [form, initialData])

  const handleSubmit = async (values: any) => {
    await onSubmit({
      ...values,
      taskId,
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialData || { orderIndex: 1, contentType: 'TEXT' }}
    >
      <Form.Item
        name="title"
        label="步骤名称"
        rules={[{ required: true, message: '请输入步骤名称' }]}
      >
        <Input placeholder="请输入步骤名称" />
      </Form.Item>

      <Form.Item
        name="contentType"
        label="内容类型"
        rules={[{ required: true, message: '请选择内容类型' }]}
      >
        <Select>
          <Select.Option value="TEXT">文本</Select.Option>
          <Select.Option value="MARKDOWN">Markdown</Select.Option>
          <Select.Option value="VIDEO">视频</Select.Option>
          <Select.Option value="QUIZ">测验</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="content"
        label="内容"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <TextArea rows={6} placeholder="请输入内容" />
      </Form.Item>

      <Form.Item
        name="orderIndex"
        label="排序序号"
        rules={[{ required: true, message: '请输入排序序号' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item name="resources" label="相关资源">
        <Upload
          action="/api/upload"
          listType="text"
          maxCount={5}
          onChange={({ fileList }) => {
            form.setFieldsValue({
              resources: fileList.map(file => file.response?.url),
            })
          }}
        >
          <Button icon={<UploadOutlined />}>上传资源</Button>
        </Upload>
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialData ? '更新步骤' : '创建步骤'}
        </Button>
      </Form.Item>
    </Form>
  )
} 