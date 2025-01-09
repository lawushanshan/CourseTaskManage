import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MonitoringDashboard } from '@/components/admin/monitoring-dashboard'
import { systemMonitor } from '@/lib/monitoring'

export const metadata: Metadata = {
  title: '系统监控 | EduFlow',
  description: '系统性能监控和日志查看',
}

export default async function MonitoringPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  // 获取最近的系统指标
  const recentMetrics = await prisma.systemMetric.findMany({
    orderBy: {
      timestamp: 'desc',
    },
    take: 60, // 最近60条记录
  })

  // 获取最近的系统日志
  const recentLogs = await prisma.systemLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: 100,
  })

  // 获取当前系统指标
  const currentMetrics = systemMonitor.getMetrics()

  return (
    <div className="container py-10">
      <MonitoringDashboard
        currentMetrics={currentMetrics}
        recentMetrics={recentMetrics}
        recentLogs={recentLogs}
      />
    </div>
  )
} 