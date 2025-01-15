'use client'

import { useState } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { createCourse, updateCourse } from '@/app/actions/courses'
import { CourseFormData } from '@/types/course'
import { COURSE_LEVELS, COURSE_LEVEL_LABELS } from '@/constants/enums'

interface CourseFormProps {
  initialValues?: CourseFormData
  mode?: 'create' | 'edit'
  role?: string
}

export function CourseForm({ initialValues, mode = 'create', role = 'teacher' }: CourseFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const onFinish = async (values: CourseFormData) => {
    console.log('=== Form Submit ===')
    console.log('Values:', values)
    
    if (!session) {
      message.error('请先登录')
      return
    }

    // 确保必填字段存在
    if (!values.title || !values.description || !values.category || !values.level) {
      message.error('请填写必要信息')
      return
    }

    setLoading(true)
    try {
      if (mode === 'edit' && initialValues?.id) {
        const course = await updateCourse(initialValues.id, values)
        message.success('课程更新成功！')
        router.push(`/courses/${role}/${course.id}/edit`)
      } else {
        const course = await createCourse(values)
        message.success('课程创建成功！')
        router.push('/courses/teacher')  // 直接跳转到课程列表
      }
    } catch (error) {
      console.error('Course operation error:', error)
      message.error(error instanceof Error ? error.message : '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      className="space-y-6"
    >
      <Form.Item
        name="title"
        label="课程标题"
        rules={[{ required: true, message: '请输入课程标题' }]}
      >
        <Input placeholder="输入课程标题" />
      </Form.Item>

      <Form.Item
        name="description"
        label="课程简介"
        rules={[{ required: true, message: '请输入课程简介' }]}
      >
        <Input.TextArea rows={4} placeholder="简要描述课程内容" />
      </Form.Item>

      <Form.Item
        name="category"
        label="课程分类"
        rules={[{ required: true, message: '请选择课程分类' }]}
      >
        <Select placeholder="选择课程分类">
          <Select.Option value="frontend">前端开发</Select.Option>
          <Select.Option value="backend">后端开发</Select.Option>
          <Select.Option value="mobile">移动开发</Select.Option>
          <Select.Option value="devops">DevOps</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="level"
        label="难度等级"
        rules={[{ required: true, message: '请选择难度等级' }]}
      >
        <Select placeholder="选择难度等级">
          {Object.entries(COURSE_LEVEL_LABELS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {mode === 'edit' ? '更新课程' : '创建课程'}
        </Button>
      </Form.Item>
    </Form>
  )
} 