'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Tag } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { User } from '@/types'

interface RoleManagementProps {
  users: User[]
}

export function RoleManagement({ users: initialUsers }: RoleManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdateRoles = async (userId: string, roles: string[]) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles }),
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, roles } : user
      ))
      message.success('角色更新成功')
      setIsModalOpen(false)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '更新失败')
    } finally {
      setLoading(false)
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
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => (
            <Tag key={role} color={
              role === 'ADMIN' ? 'red' : 
              role === 'TEACHER' ? 'blue' : 
              'green'
            }>
              {role === 'ADMIN' ? '管理员' : 
               role === 'TEACHER' ? '教师' : 
               '学生'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setEditingUser(record)
            setIsModalOpen(true)
          }}
        >
          编辑角色
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
      />

      <Modal
        title="编辑用户角色"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {editingUser && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">当前角色</h3>
              <Space className="mt-2">
                {editingUser.roles.map(role => (
                  <Tag key={role}>{role}</Tag>
                ))}
              </Space>
            </div>
            <div>
              <h3 className="font-medium">选择角色</h3>
              <Space className="mt-2">
                {['ADMIN', 'TEACHER', 'STUDENT'].map(role => (
                  <Button
                    key={role}
                    type={editingUser.roles.includes(role) ? 'primary' : 'default'}
                    onClick={() => {
                      const newRoles = editingUser.roles.includes(role)
                        ? editingUser.roles.filter(r => r !== role)
                        : [...editingUser.roles, role]
                      handleUpdateRoles(editingUser.id, newRoles)
                    }}
                    loading={loading}
                  >
                    {role === 'ADMIN' ? '管理员' : 
                     role === 'TEACHER' ? '教师' : 
                     '学生'}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
} 