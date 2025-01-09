'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, OrderedListOutlined } from '@ant-design/icons'
import { TaskForm } from './task-form'
import type { Task } from '@/types'
import Link from 'next/link'

interface TaskManagementProps {
  courseId: string
  tasks: (Task & {
    _count: {
      completedBy: number
    }
  })[]
}

export function TaskManagement({ courseId, tasks: initialTasks }: TaskManagementProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setTasks(tasks.filter(task => task.id !== id))
      message.success('任务删除成功')
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
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '完成人数',
      dataIndex: ['_count', 'completedBy'],
      key: 'completedBy',
    },
    {
      title: '步骤数',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps: any[]) => steps.length,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Task) => (
        <Space size="middle">
          <Link href={`/admin/courses/${courseId}/tasks/${record.id}/steps`}>
            <Button icon={<OrderedListOutlined />}>步骤</Button>
          </Link>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTask(record)
              setIsModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个任务吗？"
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
        <h1 className="text-2xl font-bold">任务管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
        >
          添加任务
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
      />

      <Modal
        title={editingTask ? '编辑任务' : '添加任务'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <TaskForm
          courseId={courseId}
          initialData={editingTask}
          onSubmit={async (data) => {
            setLoading(true)
            try {
              const response = await fetch(
                editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks',
                {
                  method: editingTask ? 'PUT' : 'POST',
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

              if (editingTask) {
                setTasks(
                  tasks.map((task) =>
                    task.id === editingTask.id ? result.data : task
                  )
                )
              } else {
                setTasks([...tasks, result.data])
              }

              setIsModalOpen(false)
              message.success(
                editingTask ? '任务更新成功' : '任务创建成功'
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