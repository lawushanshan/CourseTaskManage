import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import * as Sentry from '@sentry/nextjs'
import { log } from './logger'

export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    })
  }
}

export function Analytics({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <VercelAnalytics />
    </>
  )
}

interface SystemMetrics {
  memory: {
    total: number
    used: number
    free: number
  }
  cpu: {
    usage: number
    loadAvg: number[]
  }
  requests: {
    total: number
    success: number
    error: number
  }
}

class SystemMonitor {
  private metrics: SystemMetrics = {
    memory: {
      total: 0,
      used: 0,
      free: 0,
    },
    cpu: {
      usage: 0,
      loadAvg: [],
    },
    requests: {
      total: 0,
      success: 0,
      error: 0,
    },
  }

  private updateInterval: NodeJS.Timeout | null = null

  start() {
    this.updateInterval = setInterval(() => {
      this.updateMetrics()
    }, 60000) // 每分钟更新一次
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private async updateMetrics() {
    try {
      // 更新内存使用情况
      const memory = process.memoryUsage()
      this.metrics.memory = {
        total: memory.heapTotal,
        used: memory.heapUsed,
        free: memory.heapTotal - memory.heapUsed,
      }

      // 更新CPU使用情况
      this.metrics.cpu.loadAvg = process.loadavg()

      // 记录监控数据
      await prisma.systemMetric.create({
        data: {
          type: 'SYSTEM',
          metrics: this.metrics as any,
          timestamp: new Date(),
        },
      })

      log('info', 'System metrics updated', this.metrics)
    } catch (error) {
      log('error', 'Failed to update system metrics', { error })
    }
  }

  getMetrics(): SystemMetrics {
    return this.metrics
  }

  recordRequest(success: boolean) {
    this.metrics.requests.total++
    if (success) {
      this.metrics.requests.success++
    } else {
      this.metrics.requests.error++
    }
  }
}

export const systemMonitor = new SystemMonitor() 