'use client'

import { Menu } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons'

export function MainNav() {
  const pathname = usePathname()

  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: <Link href="/courses">课程</Link>,
    },
    {
      key: '/about',
      icon: <TeamOutlined />,
      label: <Link href="/about">关于</Link>,
    },
  ]

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      items={items}
      className="border-none"
    />
  )
} 