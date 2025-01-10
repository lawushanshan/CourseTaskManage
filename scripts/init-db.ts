const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建管理员用户
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@eduflow.com' },
      update: {},
      create: {
        email: 'admin@eduflow.com',
        name: 'Admin',
        password: adminPassword,
        roles: ['ADMIN'],
      },
    });

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

    console.log('Database initialized successfully');
    console.log('Test accounts:');
    console.log('Admin: admin@eduflow.com / admin123');
    console.log('Teacher: teacher@eduflow.com / teacher123');
    console.log('Student: student@eduflow.com / student123');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 