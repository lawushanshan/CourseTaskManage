'use client'

import { useState } from 'react'
import { Card, Input, Button, List, Avatar, Tag, Space, Dropdown } from 'antd'
import { MessageOutlined, LockOutlined, PushpinOutlined, MoreOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'

const { TextArea } = Input

interface Comment {
  id: string
  content: string
  isPrivate: boolean
  isPinned: boolean
  createdAt: string
  user: {
    id: string
    name: string
    avatar?: string
    roles: string[]
  }
  replies?: Comment[]
}

interface DiscussionThreadProps {
  comments: Comment[]
  targetType: 'COURSE' | 'TASK' | 'STEP'
  targetId: string
  onAddComment: (content: string, isPrivate: boolean) => Promise<void>
  onReply: (commentId: string, content: string) => Promise<void>
  onPin: (commentId: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

const MAX_COMMENT_LENGTH = 1000

export function DiscussionThread({
  comments,
  targetType,
  targetId,
  onAddComment,
  onReply,
  onPin,
  onDelete,
}: DiscussionThreadProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  const isTeacher = session?.user?.roles?.includes(Role.TEACHER)
  const isAdmin = session?.user?.roles?.includes(Role.ADMIN)

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onAddComment(content, isPrivate)
      setContent('')
      setIsPrivate(false)
    } catch (error) {
      console.error('Failed to add comment:', error)
      // 可以添加错误提示
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim() || isReplying) return
    setIsReplying(true)
    try {
      await onReply(commentId, replyContent)
      setReplyTo(null)
      setReplyContent('')
    } catch (error) {
      console.error('Failed to reply:', error)
      // 可以添加错误提示
    } finally {
      setIsReplying(false)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_COMMENT_LENGTH) {
      setContent(value)
    }
  }

  return (
    <div className="space-y-4">
      <Card title="发表讨论">
        <Space direction="vertical" className="w-full">
          <TextArea
            rows={4}
            value={content}
            onChange={handleContentChange}
            placeholder="分享你的想法..."
            maxLength={MAX_COMMENT_LENGTH}
            showCount
          />
          <div className="flex justify-between items-center">
            {(isTeacher || isAdmin) && (
              <Button
                type={isPrivate ? 'primary' : 'default'}
                icon={<LockOutlined />}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                私密讨论
              </Button>
            )}
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              发布
            </Button>
          </div>
        </Space>
      </Card>

      <List
        className="comments-list"
        itemLayout="vertical"
        dataSource={comments}
        renderItem={(comment) => (
          <Card 
            className={`mb-4 ${comment.isPinned ? 'border-blue-500' : ''}`}
            extra={
              comment.isPinned && <Tag color="blue" icon={<PushpinOutlined />}>置顶</Tag>
            }
          >
            <List.Item
              actions={[
                <Button 
                  key="reply" 
                  type="link" 
                  icon={<MessageOutlined />}
                  onClick={() => setReplyTo(comment.id)}
                >
                  回复
                </Button>,
                (isTeacher || isAdmin) && (
                  <Dropdown
                    key="more"
                    menu={{
                      items: [
                        {
                          key: 'pin',
                          label: '置顶',
                          icon: <PushpinOutlined />,
                          onClick: () => onPin(comment.id),
                        },
                        {
                          key: 'delete',
                          label: '删除',
                          danger: true,
                          onClick: () => onDelete(comment.id),
                        },
                      ],
                    }}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={comment.user.avatar} alt={comment.user.name} />}
                title={
                  <Space>
                    <span>{comment.user.name}</span>
                    {comment.user.roles.includes('TEACHER') && (
                      <Tag color="blue">教师</Tag>
                    )}
                    {comment.isPrivate && (
                      <Tag icon={<LockOutlined />} color="red">私密</Tag>
                    )}
                  </Space>
                }
                description={new Date(comment.createdAt).toLocaleString()}
              />
              <div className="ml-12">
                <p className="text-base">{comment.content}</p>
                {comment.replies?.map((reply: any) => (
                  <Card key={reply.id} className="mt-4 bg-gray-50">
                    <List.Item.Meta
                      avatar={<Avatar src={reply.user.avatar} alt={reply.user.name} />}
                      title={
                        <Space>
                          <span>{reply.user.name}</span>
                          {reply.user.roles.includes('TEACHER') && (
                            <Tag color="blue">教师</Tag>
                          )}
                        </Space>
                      }
                      description={new Date(reply.createdAt).toLocaleString()}
                    />
                    <p className="ml-12 mt-2">{reply.content}</p>
                  </Card>
                ))}
                {replyTo === comment.id && (
                  <div className="mt-4 ml-12">
                    <TextArea
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="回复..."
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button onClick={() => setReplyTo(null)}>取消</Button>
                      <Button 
                        type="primary"
                        onClick={() => handleReply(comment.id)}
                        loading={isReplying}
                      >
                        回复
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </List.Item>
          </Card>
        )}
      />
    </div>
  )
} 