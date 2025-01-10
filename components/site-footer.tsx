'use client'

import { Layout, Typography, Space } from 'antd'
import Link from 'next/link'

const { Footer } = Layout
const { Text, Link: AntLink } = Typography

export function SiteFooter() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      <Space direction="vertical" size={4}>
        <Text>© 2024 EduFlow. All rights reserved.</Text>
        <Space split="|">
          <Link href="/about" passHref>
            <AntLink>关于我们</AntLink>
          </Link>
          <Link href="/privacy" passHref>
            <AntLink>隐私政策</AntLink>
          </Link>
          <Link href="/terms" passHref>
            <AntLink>服务条款</AntLink>
          </Link>
        </Space>
      </Space>
    </Footer>
  )
} 