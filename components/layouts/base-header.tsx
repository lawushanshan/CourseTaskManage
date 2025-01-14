'use client'

import { Layout } from 'antd'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const { Header } = Layout

interface BaseHeaderProps {
  children: ReactNode
}

export function BaseHeader({ children }: BaseHeaderProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <Header 
      className="fixed z-50 w-full"
      style={{ 
        background: isHomePage ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: isHomePage ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        padding: 0,
      }}
    >
      {children}
    </Header>
  )
} 