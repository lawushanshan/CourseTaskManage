'use client'

import { useState } from 'react'
import { Rate, Input, Button, message } from 'antd'
import { useSession } from 'next-auth/react'

const { TextArea } = Input

interface CourseRatingProps {
  courseId: string
  initialRating?: number
  initialReview?: string
}

export function CourseRating({ courseId, initialRating, initialReview }: CourseRatingProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(initialRating || 0)
  const [review, setReview] = useState(initialReview || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!rating) {
      message.error('请选择评分')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType: 'COURSE',
          targetId: courseId,
          score: rating,
          review,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error)
      }

      message.success('评分成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '评分失败')
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2">课程评分</div>
        <Rate value={rating} onChange={setRating} />
      </div>
      <div>
        <div className="mb-2">评价内容</div>
        <TextArea
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="写下你的评价..."
        />
      </div>
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        提交评价
      </Button>
    </div>
  )
} 