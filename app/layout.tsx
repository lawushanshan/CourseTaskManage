import { SessionProvider } from '@/components/providers/session-provider'
import { ConfigProvider, App as AntApp } from 'antd'
import { SiteHeader } from '@/components/layout/site-header'
import zhCN from 'antd/locale/zh_CN'
import './globals.css'

const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <SessionProvider>
          <ConfigProvider
            theme={themeConfig}
            locale={zhCN}
          >
            <AntApp>
              <SiteHeader />
              {children}
            </AntApp>
          </ConfigProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 