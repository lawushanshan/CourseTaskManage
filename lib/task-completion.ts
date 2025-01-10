import { prisma } from './prisma'
import { sendNotification } from './notification'

export async function checkTaskCompletion(taskId: string, studentId: string) {
  // 获取任务的所有步骤
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      steps: true,
      course: true,
    },
  })

  if (!task) return

  // 获取学生完成的步骤
  const completedSteps = await prisma.stepCompletion.findMany({
    where: {
      stepId: { in: task.steps.map(step => step.id) },
      studentId,
    },
  })

  // 检查是否所有步骤都已完成
  if (completedSteps.length === task.steps.length) {
    // 创建任务完成记录
    await prisma.taskCompletion.create({
      data: {
        studentId,
        taskId,
      },
    })

    // 发送任务完成通知
    await sendNotification({
      userId: studentId,
      type: 'TASK',
      title: '任务完成',
      content: `恭喜你完成了任务: ${task.title}`,
      data: { taskId, courseId: task.courseId }
    })

    // 检查课程完成状态
    await checkCourseCompletion(task.courseId, studentId)
  }
} 