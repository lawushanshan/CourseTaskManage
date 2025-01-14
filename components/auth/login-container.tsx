'use client'

import { Card, Typography } from 'antd'
import { LoginForm } from './login-form'
import { Logo } from '@/components/logo'

const { Text } = Typography

export function LoginContainer() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <Logo size="large" />
        </div>
        <Text type="secondary" className="mt-4 block text-base">
          登录您的账户以继续学习
        </Text>
      </div>

      <Card 
        bordered={false}
        className="overflow-hidden shadow-lg"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          padding: '24px 32px',
        }}
        bodyStyle={{
          padding: 0
        }}
      >
        <LoginForm />
      </Card>
    </div>
  )
} 