'use client'

import { Button } from 'antd'
import { BulbOutlined, BulbFilled } from '@ant-design/icons'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      type="text"
      icon={theme === 'dark' ? <BulbOutlined /> : <BulbFilled />}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    />
  )
} 