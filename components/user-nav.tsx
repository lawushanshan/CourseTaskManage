'use client'

import { Button, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function UserNav() {
  const { data: session } = useSession()

  const userMenuItems = [
    {
      key: 'dashboard',
      icon: <UserOutlined />,
      label: <Link href="/dashboard">控制台</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => signOut(),
    },
  ]

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        type="text" 
        style={{
          height: '40px',
          padding: '4px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <UserOutlined />
        <span>{session?.user?.name || '用户'}</span>
      </Button>
    </Dropdown>
  )
} 