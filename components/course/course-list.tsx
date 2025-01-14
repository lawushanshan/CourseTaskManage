'use client'

import { useState } from 'react'
import { Card, List, Tag, Space, Input, Select, Empty } from 'antd'
import { BookOutlined, UserOutlined, StarOutlined, SearchOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const { Search } = Input

interface CourseListProps {
  courses: Array<{
    id: string
    title: string
    description: string
    category: string
    level: string
    teacher: {
      name: string
    }
    _count: {
      students: number
      ratings: number
    }
  }>
  categories: string[]
  teachers: Array<{ id: string; name: string }>
}

export function CourseList({ courses, categories, teachers }: CourseListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchText, setSearchText] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedTeacher, setSelectedTeacher] = useState(searchParams.get('teacher') || '')

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.set('q', value)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedTeacher) params.set('teacher', selectedTeacher)
    router.push(`/courses?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    const params = new URLSearchParams()
    if (searchText) params.set('q', searchText)
    if (value) params.set('category', value)
    if (selectedTeacher) params.set('teacher', selectedTeacher)
    router.push(`/courses?${params.toString()}`)
  }

  const handleTeacherChange = (value: string) => {
    setSelectedTeacher(value)
    const params = new URLSearchParams()
    if (searchText) params.set('q', searchText)
    if (selectedCategory) params.set('category', selectedCategory)
    if (value) params.set('teacher', value)
    router.push(`/courses?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Search
          placeholder="搜索课程..."
          allowClear
          enterButton
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder="选择分类"
          allowClear
          value={selectedCategory || undefined}
          onChange={handleCategoryChange}
          style={{ width: 200 }}
        >
          {categories.map((category) => (
            <Select.Option key={category} value={category}>
              {category}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="选择教师"
          allowClear
          value={selectedTeacher || undefined}
          onChange={handleTeacherChange}
          style={{ width: 200 }}
        >
          {teachers.map((teacher) => (
            <Select.Option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {courses.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={courses}
          renderItem={(course) => (
            <List.Item>
              <Link href={`/courses/${course.id}`}>
                <Card
                  hoverable
                  cover={
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <BookOutlined style={{ fontSize: '48px', color: '#666' }} />
                    </div>
                  }
                >
                  <Card.Meta
                    title={course.title}
                    description={
                      <div className="space-y-2">
                        <p className="text-gray-500 line-clamp-2">{course.description}</p>
                        <Space size={[0, 8]} wrap>
                          <Tag color="blue">{course.category}</Tag>
                          <Tag color="green">{course.level}</Tag>
                        </Space>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            <UserOutlined /> {course.teacher.name}
                          </span>
                          <span>
                            <StarOutlined /> {course._count.ratings || 0}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无课程" />
      )}
    </div>
  )
} 