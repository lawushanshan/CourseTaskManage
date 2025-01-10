'use client'

import { Avatar, Dropdown, Button, Modal } from 'antd'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'

export function UserNav() {
  const { data: session } = useSession()
  const router = useRouter()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  if (!session) return null

  const handleLogout = () => {
    setLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    signOut({ callbackUrl: '/' })
    setLogoutModalOpen(false)
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className="px-2 py-1.5">
          <div className="font-medium">{session.user.name}</div>
          <div className="text-xs text-gray-500">{session.user.email}</div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      label: '仪表板',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: 'settings',
      label: '设置',
      onClick: () => router.push('/settings'),
    },
    { type: 'divider' },
    {
      key: 'signout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button type="text" icon={
          <Avatar size="small" icon={<UserOutlined />} src={session.user.image} />
        } />
      </Dropdown>

      <Modal
        title="退出登录"
        open={logoutModalOpen}
        onOk={confirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要退出登录吗？</p>
      </Modal>
    </>
  )
} 