import { Metadata } from 'next'
import { Result, Button } from 'antd'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '账号已禁用 | EduFlow',
  description: '您的账号已被禁用',
}

export default function AccountDisabledPage() {
  return (
    <div className="container py-10">
      <Result
        status="warning"
        title="账号已禁用"
        subTitle="抱歉，您的账号已被禁用。如有疑问，请联系管理员。"
        extra={[
          <Link href="/" key="home">
            <Button type="primary">返回首页</Button>
          </Link>,
          <Button key="contact">联系管理员</Button>,
        ]}
      />
    </div>
  )
} 