'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ConfigProvider, theme } from 'antd'
import { ReactNode } from 'react'
import { BaseLayout } from '@/components/layouts/base-layout'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <ConfigProvider
        theme={{
          algorithm: [theme.defaultAlgorithm],
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
            wireframe: false,
          },
          components: {
            Button: {
              primaryColor: '#1677ff',
            },
            Card: {
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            },
          },
        }}
      >
        <BaseLayout>{children}</BaseLayout>
      </ConfigProvider>
    </NextThemesProvider>
  )
} 