'use client'

import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useSession } from 'next-auth/react'

interface CourseDiscussionProps {
  courseId: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
  }
}

export function CourseDiscussion({ courseId }: CourseDiscussionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetType: 'COURSE',
          targetId: courseId,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error)
      }

      setComments([data.data, ...comments])
      setContent('')
      toast({
        title: '评论成功',
        description: '您的评论已发布',
      })
    } catch (error) {
      toast({
        title: '评论失败',
        description: error instanceof Error ? error.message : '无法发布评论',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {session && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="写下你的想法..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? '发布中...' : '发布评论'}
          </Button>
        </form>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 