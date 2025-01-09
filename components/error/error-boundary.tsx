'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Button, Card } from 'antd'
import { log } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log('error', 'UI Error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="max-w-lg mx-auto my-8">
          <Alert
            type="error"
            message="出错了"
            description={
              <div className="space-y-4">
                <p>抱歉，页面发生了错误。</p>
                <p className="text-sm text-gray-500">
                  {this.state.error?.message}
                </p>
                <Button
                  type="primary"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  重试
                </Button>
              </div>
            }
          />
        </Card>
      )
    }

    return this.props.children
  }
} 