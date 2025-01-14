'use client'

import { useState, useEffect } from 'react'
import { Badge, Popover, List, Typography, Tag, Button } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import { getUserNotifications, markNotificationAsRead } from '@/lib/notification'

const { Text } = Typography

const typeColors = {
  SYSTEM: 'blue',
  COURSE: 'green',
  TASK: 'gold',
  COMMENT: 'purple',
  RATING: 'red',
}

export function NotificationCenter() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const data = await getUserNotifications(session.user.id)
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // 设置定时刷新
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [session?.user?.id])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const content = (
    <List
      className="w-80 max-h-96 overflow-auto"
      loading={loading}
      dataSource={notifications}
      renderItem={(notification: any) => (
        <List.Item
          className={`cursor-pointer transition-colors ${
            !notification.isRead ? 'bg-blue-50' : ''
          }`}
          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
        >
          <List.Item.Meta
            title={
              <div className="flex justify-between items-center">
                <Text strong>{notification.title}</Text>
                <Tag color={typeColors[notification.type]}>
                  {notification.type}
                </Tag>
              </div>
            }
            description={
              <div>
                <Text>{notification.content}</Text>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  )

  return (
    <Popover
      content={content}
      title={
        <div className="flex justify-between items-center">
          <span>通知中心</span>
          <Button type="link" size="small" onClick={fetchNotifications}>
            刷新
          </Button>
        </div>
      }
      trigger="click"
      placement="bottomRight"
    >
      <Badge count={unreadCount} className="cursor-pointer">
        <BellOutlined className="text-xl" />
      </Badge>
    </Popover>
  )
} 