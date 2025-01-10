'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Input, Form, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onFinish(values: { email: string; password: string }) {
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        message.error('邮箱或密码错误')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Form 
        onFinish={onFinish} 
        size="large"
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="邮箱"
            autoComplete="email"
            style={{ height: '44px' }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          style={{ marginBottom: '12px' }}
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="密码"
            autoComplete="current-password"
            style={{ height: '44px' }}
          />
        </Form.Item>

        <div className="mb-4 flex items-center justify-between">
          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            忘记密码？
          </Link>
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
            style={{ height: '44px' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-6 text-center">
        <Divider plain className="text-gray-400">
          还没有账号？
        </Divider>
        <Link 
          href="/register" 
          className="inline-block text-blue-600 hover:text-blue-800"
        >
          立即注册
        </Link>
      </div>
    </div>
  )
} 