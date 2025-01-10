'use client'

import { Button, Space, Menu } from 'antd'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { UserNav } from '@/components/user-nav'
import { Logo } from '@/components/logo'
import { usePathname } from 'next/navigation'

export function SiteHeaderContent() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const pathname = usePathname()

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
    <div className="header-content">
      <div className="header-wrapper">
        <div className="header-left">
          <Link href="/" className="logo-link">
            <Logo 
              size="small" 
              theme={pathname === '/' ? 'dark' : 'light'} 
            />
          </Link>
          <Menu 
            mode="horizontal" 
            selectedKeys={[pathname]}
            items={menuItems}
            className="main-menu"
            style={{ 
              background: 'transparent',
              borderBottom: 'none',
            }}
          />
        </div>

        <div className="header-right">
          {loading ? null : session ? (
            <UserNav />
          ) : (
            <Space size="middle">
              <Link href="/login">
                <Button type="link">登录</Button>
              </Link>
              <Link href="/register">
                <Button type="primary">免费注册</Button>
              </Link>
            </Space>
          )}
        </div>
      </div>
    </div>
  )
} 