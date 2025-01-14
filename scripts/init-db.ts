import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Starting database initialization...')

    // 创建管理员用户
    console.log('Creating admin user...')
    const adminPassword = await hash('admin123', 12)
    await prisma.user.upsert({
      where: { email: 'admin@eduflow.com' },
      update: {},
      create: {
        email: 'admin@eduflow.com',
        name: 'Admin',
        password: adminPassword,
        roles: ['ADMIN'],
      },
    })
    console.log('Admin user created successfully')

    // 创建测试教师
    console.log('Creating test teacher...')
    const teacherPassword = await hash('teacher123', 12)
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher@eduflow.com' },
      update: {},
      create: {
        email: 'teacher@eduflow.com',
        name: '测试教师',
        password: teacherPassword,
        roles: ['TEACHER'],
      },
    })
    console.log('Test teacher created:', teacher.email)

    // 创建测试学生
    console.log('Creating test student...')
    const studentPassword = await hash('student123', 12)
    await prisma.user.upsert({
      where: { email: 'student@eduflow.com' },
      update: {},
      create: {
        email: 'student@eduflow.com',
        name: '测试学生',
        password: studentPassword,
        roles: ['STUDENT'],
      },
    })
    console.log('Test student created successfully')

    // 创建系统设置
    console.log('Creating system settings...')
    await prisma.systemSetting.upsert({
      where: { id: '1' },
      update: {},
      create: {
        siteName: 'EduFlow',
        siteDescription: '在线学习平台',
        maxUploadSize: 5,
        allowRegistration: true,
        maintenanceMode: false,
        allowMultipleRoles: true,
        defaultUserRole: 'STUDENT',
      },
    })
    console.log('System settings created successfully')

    console.log('\nDatabase initialization completed successfully!')
    console.log('\nTest accounts:')
    console.log('- Admin: admin@eduflow.com / admin123')
    console.log('- Teacher: teacher@eduflow.com / teacher123')
    console.log('- Student: student@eduflow.com / student123')
  } catch (error) {
    console.error('Error during database initialization:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 执行初始化
main()
  .catch((error) => {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }) 