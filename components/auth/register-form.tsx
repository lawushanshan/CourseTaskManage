'use client'

import { useState } from 'react'
import { Form, Input, Button, Radio, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface RegisterFormData {
  name: string
  email: string
  password: string
  role: 'STUDENT' | 'TEACHER'
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = async (values: RegisterFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      message.success('注册成功！正在跳转到登录页面...')
      router.push('/login')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      name="register"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: '请输入您的姓名' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="姓名"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="邮箱"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度至少为6位' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="role"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Radio.Group size="large">
          <Radio.Button value="STUDENT">学生</Radio.Button>
          <Radio.Button value="TEACHER">教师</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          注册
        </Button>
      </Form.Item>
    </Form>
  )
} 