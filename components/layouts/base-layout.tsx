'use client'

import { Layout } from 'antd'
import { ReactNode } from 'react'

interface BaseLayoutProps {
  children: ReactNode
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Layout className="min-h-screen">
      {children}
    </Layout>
  )
} 