import { prisma } from './prisma'
import { log } from './logger'
import type { NotificationType } from '@prisma/client'

interface NotificationData {
  userId: string
  type: NotificationType
  title: string
  content: string
  data?: Record<string, any>
}

export async function sendNotification({
  userId,
  type,
  title,
  content,
  data,
}: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        data: data || {},
      },
    })

    // 这里可以添加实时推送逻辑，比如使用WebSocket
    // pushNotification(notification)

    log('info', 'Notification sent', { notification })
    return notification
  } catch (error) {
    log('error', 'Failed to send notification', { error })
    throw error
  }
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })
}

export async function getUserNotifications(userId: string, limit = 10) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  })
} 