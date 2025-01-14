'use client'

import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface CourseSearchProps {
  categories: string[]
  teachers: Array<{ id: string; name: string }>
  onSearch?: (values: any) => void
}

export function CourseSearch({ categories, teachers, onSearch }: CourseSearchProps) {
  return (
    <div className="mb-8 flex gap-4">
      <Input
        placeholder="搜索课程..."
        prefix={<SearchOutlined />}
        className="max-w-xs"
        onChange={(e) => onSearch?.({ q: e.target.value })}
      />
      <Select
        placeholder="选择分类"
        allowClear
        className="min-w-[200px]"
        onChange={(value) => onSearch?.({ category: value })}
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
        className="min-w-[200px]"
        onChange={(value) => onSearch?.({ teacher: value })}
      >
        {teachers.map((teacher) => (
          <Select.Option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
} 