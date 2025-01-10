'use client'

import { Layout, Menu, theme } from 'antd'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons'

const { Content, Sider } = Layout

interface ProLayoutProps {
  children: ReactNode
}

export function ProLayout({ children }: ProLayoutProps) {
  const pathname = usePathname()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">仪表板</Link>,
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: <Link href="/courses">课程</Link>,
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: <Link href="/students">学生</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">设置</Link>,
    },
  ]

  // 只在后台页面显示侧边栏
  const showSider = pathname !== '/' && (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/courses') || 
    pathname.startsWith('/settings')
  )

  // 主页不需要额外的内边距和背景色
  const isHomePage = pathname === '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showSider && (
        <Sider
          width={256}
          style={{
            background: colorBgContainer,
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
            position: 'fixed',
            left: 0,
            top: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
      )}
      <Layout style={{ 
        marginLeft: showSider ? 256 : 0, 
        marginTop: isHomePage ? 0 : 64,
      }}>
        <Content
          style={{
            margin: isHomePage ? 0 : '24px 16px',
            padding: isHomePage ? 0 : 24,
            minHeight: 280,
            background: isHomePage ? 'transparent' : colorBgContainer,
            borderRadius: isHomePage ? 0 : 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
} 