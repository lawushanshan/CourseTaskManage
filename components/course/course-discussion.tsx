'use client'

import { useState } from 'react'
import { Button, Input, message } from 'antd'
import { useSession } from 'next-auth/react'

const { TextArea } = Input

interface CourseDiscussionProps {
  courseId: string
}

export function CourseDiscussion({ courseId }: CourseDiscussionProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('请输入评论内容')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('提交评论失败')
      }

      setContent('')
      message.success('评论提交成功')
    } catch (error) {
      message.error('评论提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的想法..."
        rows={4}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
      >
        提交评论
      </Button>
    </div>
  )
} 