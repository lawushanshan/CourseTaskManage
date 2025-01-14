import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CourseList } from '@/components/course/course-list'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionDebug } from '@/components/debug/session-debug'

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
  const session = await getServerSession(authOptions)
  
  // 添加调试日志
  console.log('=== Debug Info ===')
  console.log('Current session:', session)
  console.log('User:', session?.user)
  console.log('User roles:', session?.user?.roles)
  
  const isTeacher = session?.user?.roles?.includes('TEACHER') || false
  console.log('Is teacher:', isTeacher)
  console.log('=== End Debug Info ===')

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
    <SessionDebug session={session} isTeacher={isTeacher}>
      <PageContainer
        title="课程管理"
        extra={
          isTeacher ? [
            <Link key="create" href="/courses/create">
              <Button type="primary" icon={<PlusOutlined />}>
                创建课程
              </Button>
            </Link>
          ] : undefined
        }
      >
        <CourseList 
          courses={courses}
          categories={categories.map(c => c.category)}
          teachers={teachers}
        />
      </PageContainer>
    </SessionDebug>
  )
} 