import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // 创建管理员用户
    const adminPassword = await hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@eduflow.com' },
      update: {},
      create: {
        email: 'admin@eduflow.com',
        name: '系统管理员',
        password: adminPassword,
        roles: ['ADMIN'],
      },
    })

    // 创建测试教师
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

    // 创建测试学生
    const studentPassword = await hash('student123', 12)
    const student = await prisma.user.upsert({
      where: { email: 'student@eduflow.com' },
      update: {},
      create: {
        email: 'student@eduflow.com',
        name: '测试学生',
        password: studentPassword,
        roles: ['STUDENT'],
      },
    })

    // 创建系统设置
    await prisma.systemSetting.upsert({
      where: { id: '1' },
      update: {},
      create: {
        siteName: 'EduFlow',
        siteDescription: '在线学习平台',
        maxUploadSize: 5,
        allowRegistration: true,
        maintenanceMode: false,
      },
    })

    console.log('数据库初始化成功!')
    console.log('测试账号:')
    console.log('管理员: admin@eduflow.com / admin123')
    console.log('教师: teacher@eduflow.com / teacher123')
    console.log('学生: student@eduflow.com / student123')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 