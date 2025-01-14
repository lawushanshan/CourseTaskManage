import { Metadata } from 'next'
import { LoginContainer } from '@/components/auth/login-container'

export const metadata: Metadata = {
  title: '登录 | EduFlow',
  description: '登录到您的账户',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md px-4 py-8 sm:px-0">
        <LoginContainer />
      </div>
    </div>
  )
} 