'use client'

import { useState } from 'react'
import { List, Button, Modal, Form, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TaskItem } from './task-item'

interface TaskListProps {
  courseId: string
  initialTasks: any[] // 稍后添加具体类型
}

export function TaskList({ courseId, initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleAddTask = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          courseId,
          orderIndex: tasks.length,
        }),
      })

      if (!response.ok) {
        throw new Error('添加任务失败')
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
      message.success('任务添加成功')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('添加任务失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        block
      >
        添加任务
      </Button>

      <List
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={(updatedTask) => {
              setTasks(tasks.map(t => 
                t.id === updatedTask.id ? updatedTask : t
              ))
            }}
            onDelete={(taskId) => {
              setTasks(tasks.filter(t => t.id !== taskId))
            }}
          />
        )}
      />

      <Modal
        title="添加任务"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTask}
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="输入任务标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <Input.TextArea rows={4} placeholder="描述任务内容" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button type="primary" htmlType="submit" loading={loading}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 