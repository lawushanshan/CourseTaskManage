import { PrismaClient, CourseStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed data initialization...')
  
  try {
    // 获取测试教师ID
    console.log('Finding test teacher account...')
    const teacher = await prisma.user.findUnique({
      where: { email: 'teacher@eduflow.com' }
    })

    if (!teacher) {
      console.error('Test teacher account not found. Please run init-db.ts first.')
      throw new Error('Test teacher account not found')
    }

    console.log('Found teacher account:', teacher.email)

    // 添加测试课程数据
    console.log('Creating test courses...')
    const coursesData = [
      {
        title: 'Web开发基础',
        description: '学习HTML、CSS和JavaScript基础',
        category: '前端开发',
        level: 'BEGINNER',
        status: 'PUBLISHED' as CourseStatus,
        teacherId: teacher.id,
      },
      {
        title: 'React进阶课程',
        description: '深入学习React框架',
        category: '前端开发',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED' as CourseStatus,
        teacherId: teacher.id,
      },
      {
        title: 'Node.js后端开发',
        description: '使用Node.js构建后端服务',
        category: '后端开发',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED' as CourseStatus,
        teacherId: teacher.id,
      },
      {
        title: 'Python数据分析',
        description: '使用Python进行数据分析和可视化',
        category: '数据科学',
        level: 'BEGINNER',
        status: 'PUBLISHED' as CourseStatus,
        teacherId: teacher.id,
      },
      {
        title: 'Vue.js实战',
        description: '使用Vue.js构建现代化前端应用',
        category: '前端开发',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED' as CourseStatus,
        teacherId: teacher.id,
      }
    ]

    for (const courseData of coursesData) {
      await prisma.course.create({
        data: courseData
      })
      console.log(`Created course: ${courseData.title}`)
    }

    console.log('Seed data has been added successfully')
  } catch (error) {
    console.error('Error during seed process:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Cleaning up...')
    await prisma.$disconnect()
  }) 