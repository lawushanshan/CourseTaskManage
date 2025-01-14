'use client'

import { Card } from 'antd'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  title?: string
  extra?: ReactNode[]
}

export function PageContainer({ children, title, extra }: PageContainerProps) {
  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <div className="bg-white h-[120px] mb-[-48px] px-6">
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="space-x-4">
            {extra}
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 pt-12">
        <Card bordered={false}>
          {children}
        </Card>
      </div>
    </div>
  )
} 