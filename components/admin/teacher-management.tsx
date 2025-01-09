'use client'

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Tag, Card, Select } from 'antd'
import { EditOutlined, BookOutlined } from '@ant-design/icons'
import type { User, Course } from '@/types'

interface TeacherManagementProps {
  teachers: (User & {
    teachingCourses: (Course & {
      _count: {
        students: number
      }
    })[]
    _count: {
      teachingCourses: number
    }
  })[]
  courses: Pick<Course, 'id' | 'title' | 'teacherId'>[]
}

export function TeacherManagement({ teachers: initialTeachers, courses }: TeacherManagementProps) {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAssignCourse = async (teacherId: string, courseId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/teacher`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId }),
      })
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // 更新本地状态
      setTeachers(teachers.map(teacher => {
        if (teacher.id === teacherId) {
          return {
            ...teacher,
            teachingCourses: [...teacher.teachingCourses, data.data],
            _count: {
              ...teacher._count,
              teachingCourses: teacher._count.teachingCourses + 1
            }
          }
        }
        return teacher
      }))

      message.success('课程分配成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '教师名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '课程数量',
      dataIndex: ['_count', 'teachingCourses'],
      key: 'courseCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<BookOutlined />}
            onClick={() => {
              setSelectedTeacher(record)
              setIsModalOpen(true)
            }}
          >
            课程管理
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <Card title="教授的课程" size="small">
              {record.teachingCourses.map(course => (
                <div key={course.id} className="flex justify-between items-center py-2">
                  <span>{course.title}</span>
                  <Space>
                    <Tag color={
                      course.status === 'PUBLISHED' ? 'green' :
                      course.status === 'DRAFT' ? 'gold' :
                      'red'
                    }>
                      {course.status === 'PUBLISHED' ? '已发布' :
                       course.status === 'DRAFT' ? '草稿' :
                       '已归档'}
                    </Tag>
                    <span>学生数: {course._count.students}</span>
                  </Space>
                </div>
              ))}
            </Card>
          ),
        }}
      />

      <Modal
        title="分配课程"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedTeacher && (
          <div className="space-y-4">
            <h3>为 {selectedTeacher.name} 分配课程</h3>
            <Select
              style={{ width: '100%' }}
              placeholder="选择课程"
              onChange={(courseId) => handleAssignCourse(selectedTeacher.id, courseId)}
              loading={loading}
            >
              {courses
                .filter(course => course.teacherId !== selectedTeacher.id)
                .map(course => (
                  <Select.Option key={course.id} value={course.id}>
                    {course.title}
                  </Select.Option>
                ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  )
} 