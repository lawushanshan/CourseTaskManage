import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录 | EduFlow',
  description: '登录到 EduFlow 开始您的学习之旅',
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            欢迎回来
          </h1>
          <p className="text-sm text-muted-foreground">
            请输入您的邮箱和密码登录
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 