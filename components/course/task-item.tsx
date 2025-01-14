'use client'

import { useState } from 'react'
import { Card, Button, Modal, Form, Input, Collapse, Space, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { StepList } from './step-list'

const { Panel } = Collapse

interface TaskItemProps {
  task: {
    id: string
    title: string
    description: string
    steps: any[]
    orderIndex: number
  }
  onUpdate: (task: any) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleEdit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('更新任务失败')
      }

      const updatedTask = await response.json()
      onUpdate(updatedTask)
      message.success('任务更新成功')
      setIsEditModalOpen(false)
    } catch (error) {
      message.error('更新任务失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除任务失败')
      }

      onDelete(task.id)
      message.success('任务删除成功')
    } catch (error) {
      message.error('删除任务失败，请重试')
    }
  }

  return (
    <Card
      className="mb-4"
      title={task.title}
      extra={
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(task)
              setIsEditModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个任务吗？"
            description="删除后无法恢复，其下的所有步骤也会被删除。"
            onConfirm={handleDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600">{task.description}</p>
        
        <Collapse>
          <Panel 
            header={`步骤 (${task.steps.length})`} 
            key="steps"
            extra={
              <Button 
                type="link" 
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  // 处理添加步骤的逻辑
                }}
              >
                添加步骤
              </Button>
            }
          >
            <StepList taskId={task.id} steps={task.steps} />
          </Panel>
        </Collapse>
      </div>

      <Modal
        title="编辑任务"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
          initialValues={task}
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
            <Space>
              <Button onClick={() => setIsEditModalOpen(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
} 