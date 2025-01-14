import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CourseSearch } from '@/components/course/course-search'
import { CourseList } from '@/components/course/course-list'

export const metadata: Metadata = {
  title: '课程列表 | EduFlow',
  description: '浏览所有课程',
}

interface CoursesPageProps {
  searchParams: {
    q?: string
    category?: string
    level?: string
    teacher?: string
    price?: string
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  // 修改获取分类的查询方式
  const [categories, teachers] = await Promise.all([
    prisma.$queryRaw<Array<{ category: string }>>`
      SELECT DISTINCT category 
      FROM "Course" 
      WHERE category IS NOT NULL 
      AND status = 'PUBLISHED'::text::"CourseStatus"
      ORDER BY category
    `,
    prisma.user.findMany({
      where: { roles: { has: 'TEACHER' } },
      select: { id: true, name: true },
    }),
  ])

  // 构建查询条件
  const where = {
    status: 'PUBLISHED',
    ...(searchParams.q && {
      OR: [
        { title: { contains: searchParams.q, mode: 'insensitive' } },
        { description: { contains: searchParams.q, mode: 'insensitive' } },
      ],
    }),
    ...(searchParams.category && { category: searchParams.category }),
    ...(searchParams.level && { level: searchParams.level }),
    ...(searchParams.teacher && { teacherId: searchParams.teacher }),
    ...(searchParams.price && {
      price: {
        gte: parseInt(searchParams.price.split('-')[0]),
        lte: parseInt(searchParams.price.split('-')[1]),
      },
    }),
  }

  // 获取课程列表
  const courses = await prisma.course.findMany({
    where,
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
          ratings: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container py-10">
      <CourseSearch
        categories={categories.map(c => c.category)}
        teachers={teachers}
      />
      <CourseList courses={courses} />
    </div>
  )
} 