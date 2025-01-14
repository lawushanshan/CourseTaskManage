'use client'

import { Button, Layout, Menu, Space, theme } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'
import { UserNav } from '@/components/user-nav'

const { Header } = Layout
const { useToken } = theme

export function SiteHeader() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const pathname = usePathname()
  const { token } = useToken()

  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/courses') || 
                          pathname.startsWith('/teachers') || 
                          pathname.startsWith('/students')

  if (isDashboardRoute) {
    return null
  }

  const menuItems = [
    {
      key: '/',
      label: <Link href="/">首页</Link>,
    },
    {
      key: '/courses',
      label: <Link href="/courses">课程</Link>,
    },
    {
      key: '/about',
      label: <Link href="/about">关于</Link>,
    },
  ]

  return (
    <div className="sticky top-0 z-10">
      <Header 
        style={{ 
          background: token.colorBgContainer,
          height: '64px',
          lineHeight: '64px',
          padding: '0 50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: token.boxShadow,
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '48px',
        }}>
          <Link 
            href="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Logo size="small" theme={pathname === '/' ? 'dark' : 'light'} />
          </Link>
          <Menu 
            mode="horizontal" 
            selectedKeys={[pathname]}
            items={menuItems}
            style={{
              border: 'none',
              background: 'transparent',
              minWidth: '300px',
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          {loading ? null : session ? (
            <UserNav />
          ) : (
            <Space size={16}>
              <Link href="/login">
                <Button 
                  type="text" 
                  icon={<LoginOutlined />}
                  style={{
                    height: '40px',
                    padding: '4px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  type="primary"
                  style={{
                    height: '40px',
                    padding: '4px 24px',
                  }}
                >
                  免费注册
                </Button>
              </Link>
            </Space>
          )}
        </div>
      </Header>
    </div>
  )
} 