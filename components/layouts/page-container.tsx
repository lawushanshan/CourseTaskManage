'use client'

import { Card, Typography } from 'antd'
import { ReactNode } from 'react'

const { Title } = Typography

interface PageContainerProps {
  title: string
  subtitle?: string
  extra?: ReactNode
  children: ReactNode
}

export function PageContainer({ title, subtitle, extra, children }: PageContainerProps) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-heading">
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>{title}</Title>
            {subtitle && (
              <div className="text-gray-500 mt-1">{subtitle}</div>
            )}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  )
} 