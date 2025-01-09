'use client'

import { useState } from 'react'
import { Input, Select, Slider, Space, Card, Drawer, Button } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { Level } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMediaQuery } from '@/hooks/use-media-query'

const { Option } = Select

interface CourseSearchProps {
  categories: string[]
  teachers: { id: string; name: string }[]
}

export function CourseSearch({ categories, teachers }: CourseSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [filterVisible, setFilterVisible] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleSearch = (values: any) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value as string)
      } else {
        params.delete(key)
      }
    })
    router.push(`/courses?${params.toString()}`)
    if (isMobile) {
      setFilterVisible(false)
    }
  }

  const FilterContent = () => (
    <Space direction="vertical" className="w-full">
      <Select
        placeholder="选择分类"
        allowClear
        className="w-full"
        onChange={(value) => handleSearch({ category: value })}
        defaultValue={searchParams.get('category') || undefined}
      >
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="选择难度"
        allowClear
        className="w-full"
        onChange={(value) => handleSearch({ level: value })}
        defaultValue={searchParams.get('level') || undefined}
      >
        {Object.values(Level).map((level) => (
          <Option key={level} value={level}>
            {level}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="选择教师"
        allowClear
        className="w-full"
        onChange={(value) => handleSearch({ teacher: value })}
        defaultValue={searchParams.get('teacher') || undefined}
      >
        {teachers.map((teacher) => (
          <Option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </Option>
        ))}
      </Select>
      <div className="px-4">
        <p className="mb-2">价格范围</p>
        <Slider
          range
          min={0}
          max={1000}
          value={priceRange}
          onChange={setPriceRange}
          onAfterChange={(value) => handleSearch({ price: value.join('-') })}
        />
      </div>
    </Space>
  )

  return (
    <Card className="mb-6">
      <Space direction="vertical" className="w-full">
        <div className="flex gap-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索课程..."
            onChange={(e) => handleSearch({ q: e.target.value })}
            defaultValue={searchParams.get('q') || ''}
            className="flex-1"
          />
          {isMobile && (
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterVisible(true)}
            >
              筛选
            </Button>
          )}
        </div>
        {isMobile ? (
          <Drawer
            title="筛选条件"
            placement="right"
            onClose={() => setFilterVisible(false)}
            open={filterVisible}
          >
            <FilterContent />
          </Drawer>
        ) : (
          <FilterContent />
        )}
      </Space>
    </Card>
  )
} 