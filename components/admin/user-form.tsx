'use client'

import { Form, Input, Select, Switch, Button } from 'antd'
import { useEffect } from 'react'
import type { User } from '@/types'

interface UserFormProps {
  initialData?: User | null
  onSubmit: (data: Partial<User>) => Promise<void>
  loading?: boolean
}

export function UserForm({ initialData, onSubmit, loading }: UserFormProps) {
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
      initialValues={initialData || { role: 'USER', isActive: true }}
    >
      <Form.Item
        name="name"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      {!initialData && (
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能小于6位' }
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select>
          <Select.Option value="USER">普通用户</Select.Option>
          <Select.Option value="ADMIN">管理员</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="isActive"
        label="状态"
        valuePropName="checked"
      >
        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialData ? '更新用户' : '创建用户'}
        </Button>
      </Form.Item>
    </Form>
  )
} 