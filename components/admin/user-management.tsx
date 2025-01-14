'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { UserForm } from './user-form'
import type { User } from '@/types'

interface UserManagementProps {
  users: (User & {
    _count: {
      enrolledCourses: number
      completedSteps: number
      comments: number
    }
  })[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setUsers(users.filter(user => user.id !== id))
      message.success('用户删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setUsers(users.map(user => 
        user.id === id ? { ...user, isActive } : user
      ))
      message.success(`用户${isActive ? '启用' : '禁用'}成功`)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '已报名课程',
      dataIndex: ['_count', 'enrolledCourses'],
      key: 'enrolledCourses',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record)
              setIsModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Button
            icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record.id, !record.isActive)}
          >
            {record.isActive ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
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
      <div className="mb-4">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <UserForm
          initialData={editingUser}
          onSubmit={async (data) => {
            setLoading(true)
            try {
              const response = await fetch(
                editingUser ? `/api/users/${editingUser.id}` : '/api/users',
                {
                  method: editingUser ? 'PUT' : 'POST',
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

              if (editingUser) {
                setUsers(
                  users.map((user) =>
                    user.id === editingUser.id ? result.data : user
                  )
                )
              } else {
                setUsers([result.data, ...users])
              }

              setIsModalOpen(false)
              message.success(
                editingUser ? '用户更新成功' : '用户创建成功'
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