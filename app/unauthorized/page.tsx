import { Metadata } from 'next'
import { Result, Button } from 'antd'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '无权限访问 | EduFlow',
  description: '您没有权限访问此页面',
}

export default function UnauthorizedPage() {
  return (
    <div className="container py-10">
      <Result
        status="403"
        title="无权限访问"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={[
          <Link href="/dashboard" key="dashboard">
            <Button type="primary">返回仪表板</Button>
          </Link>,
          <Link href="/" key="home">
            <Button>返回首页</Button>
          </Link>,
        ]}
      />
    </div>
  )
} 