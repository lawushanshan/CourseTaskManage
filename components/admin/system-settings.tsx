'use client'

import { Form, Input, InputNumber, Switch, Button, Card, message } from 'antd'
import { useState } from 'react'
import type { SystemSetting } from '@/types'

interface SystemSettingsProps {
  initialData?: SystemSetting | null
}

export function SystemSettings({ initialData }: SystemSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      message.success('设置保存成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialData || {
            siteName: 'EduFlow',
            siteDescription: '在线学习平台',
            maxUploadSize: 5,
            allowRegistration: true,
            maintenanceMode: false,
          }}
        >
          <Form.Item
            name="siteName"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="siteDescription"
            label="网站描述"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="maxUploadSize"
            label="最大上传大小(MB)"
            rules={[{ required: true, message: '请输入最大上传大小' }]}
          >
            <InputNumber min={1} max={50} />
          </Form.Item>

          <Form.Item
            name="allowRegistration"
            label="允许注册"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="maintenanceMode"
            label="维护模式"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
} 