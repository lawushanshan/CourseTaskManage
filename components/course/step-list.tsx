'use client'

import { useState } from 'react'
import { List, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

interface StepListProps {
  taskId: string
  steps: Array<{
    id: string
    title: string
    description: string
    orderIndex: number
  }>
}

export function StepList({ taskId, steps }: StepListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentSteps, setCurrentSteps] = useState(steps)

  const handleAddStep = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          taskId,
          orderIndex: currentSteps.length,
        }),
      })

      if (!response.ok) {
        throw new Error('添加步骤失败')
      }

      const newStep = await response.json()
      setCurrentSteps([...currentSteps, newStep])
      message.success('步骤添加成功')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('添加步骤失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    try {
      const response = await fetch(`/api/steps/${stepId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除步骤失败')
      }

      setCurrentSteps(currentSteps.filter(step => step.id !== stepId))
      message.success('步骤删除成功')
    } catch (error) {
      message.error('删除步骤失败，请重试')
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
        添加步骤
      </Button>

      <List
        dataSource={currentSteps}
        renderItem={(step) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue(step)
                  setIsModalOpen(true)
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                title="确定要删除这个步骤吗？"
                onConfirm={() => handleDeleteStep(step.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={step.title}
              description={step.description}
            />
          </List.Item>
        )}
      />

      <Modal
        title="添加/编辑步骤"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStep}
        >
          <Form.Item
            name="title"
            label="步骤标题"
            rules={[{ required: true, message: '请输入步骤标题' }]}
          >
            <Input placeholder="输入步骤标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="步骤描述"
          >
            <Input.TextArea rows={4} placeholder="描述步骤内容" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 