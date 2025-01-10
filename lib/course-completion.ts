import { prisma } from './prisma'
import { sendNotification } from './notification'

export async function checkCourseCompletion(courseId: string, studentId: string) {
  // 获取课程的所有任务
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      tasks: true,
    },
  })

  if (!course) return

  // 获取学生完成的任务
  const completedTasks = await prisma.taskCompletion.findMany({
    where: {
      taskId: { in: course.tasks.map(task => task.id) },
      studentId,
    },
  })

  // 检查是否所有任务都已完成
  if (completedTasks.length === course.tasks.length) {
    // 创建课程完成记录
    await prisma.courseCompletion.create({
      data: {
        studentId,
        courseId,
      },
    })

    // 发送课程完成通知
    await sendNotification({
      userId: studentId,
      type: 'COURSE',
      title: '课程完成',
      content: `恭喜你完成了课程: ${course.title}`,
      data: { courseId }
    })
  }
} 