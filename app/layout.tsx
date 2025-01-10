import { SessionProvider } from '@/components/providers/session-provider'
import { ProLayout } from '@/components/layouts/pro-layout'
import { SiteHeader } from '@/components/site-header'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '@/styles/header.css'

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
              <ProLayout>{children}</ProLayout>
            </AntApp>
          </ConfigProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 