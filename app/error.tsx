'use client'

import { useEffect } from 'react'
import { Button, Result } from 'antd'
import { log } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    log('error', 'Page Error', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <Result
      status="error"
      title="出错了"
      subTitle={error.message}
      extra={[
        <Button type="primary" key="retry" onClick={reset}>
          重试
        </Button>,
      ]}
    />
  )
} 