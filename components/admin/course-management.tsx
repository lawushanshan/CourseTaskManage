'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { CourseForm } from './course-form'
import type { Course } from '@/types'

interface CourseManagementProps {
  courses: (Course & {
    _count: {
      students: number
      tasks: number
    }
  })[]
}

export function CourseManagement({ courses: initialCourses }: CourseManagementProps) {
  const [courses, setCourses] = useState(initialCourses)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setCourses(courses.filter(course => course.id !== id))
      message.success('课程删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '讲师',
      dataIndex: ['teacher', 'name'],
      key: 'teacher',
    },
    {
      title: '学生数',
      dataIndex: ['_count', 'students'],
      key: 'students',
    },
    {
      title: '任务数',
      dataIndex: ['_count', 'tasks'],
      key: 'tasks',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Course) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCourse(record)
              setIsModalOpen(true)
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个课程吗？"
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
        <h1 className="text-2xl font-bold">课程管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCourse(null)
            setIsModalOpen(true)
          }}
        >
          添加课程
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <CourseForm
          initialData={editingCourse}
          onSubmit={async (data) => {
            setLoading(true)
            try {
              const response = await fetch(
                editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses',
                {
                  method: editingCourse ? 'PUT' : 'POST',
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

              if (editingCourse) {
                setCourses(
                  courses.map((course) =>
                    course.id === editingCourse.id ? result.data : course
                  )
                )
              } else {
                setCourses([result.data, ...courses])
              }

              setIsModalOpen(false)
              message.success(
                editingCourse ? '课程更新成功' : '课程创建成功'
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