'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { StepForm } from './step-form'
import type { Step } from '@/types'

interface StepManagementProps {
  taskId: string
  steps: Step[]
}

export function StepManagement({ taskId, steps: initialSteps }: StepManagementProps) {
  const [steps, setSteps] = useState(initialSteps)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<Step | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/steps/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setSteps(steps.filter(step => step.id !== id))
      message.success('步骤删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: 80,
    },
    {
      title: '步骤名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容类型',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (type: string) => ({
        TEXT: '文本',
        MARKDOWN: 'Markdown',
        VIDEO: '视频',
        QUIZ: '测验',
      }[type]),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Step) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingStep(record)
              setIsModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个步骤吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">步骤管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStep(null)
            setIsModalOpen(true)
          }}
        >
          添加步骤
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={steps}
        rowKey="id"
      />

      <Modal
        title={editingStep ? '编辑步骤' : '添加步骤'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <StepForm
          taskId={taskId}
          initialData={editingStep}
          onSubmit={async (data) => {
            setLoading(true)
            try {
              const response = await fetch(
                editingStep ? `/api/steps/${editingStep.id}` : '/api/steps',
                {
                  method: editingStep ? 'PUT' : 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                }
              )
              const result = await response.json()

              if (!result.success) {
                throw new Error(result.error)
              }

              if (editingStep) {
                setSteps(
                  steps.map((step) =>
                    step.id === editingStep.id ? result.data : step
                  )
                )
              } else {
                setSteps([...steps, result.data])
              }

              setIsModalOpen(false)
              message.success(
                editingStep ? '步骤更新成功' : '步骤创建成功'
              )
            } catch (error) {
              message.error(
                error instanceof Error ? error.message : '操作失败'
              )
            } finally {
              setLoading(false)
            }
          }}
          loading={loading}
        />
      </Modal>
    </div>
  )
} 