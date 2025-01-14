import { unstable_cache } from 'next/cache'

export const getCachedCourse = unstable_cache(
  async (courseId: string) => {
    // 获取课程数据
    return await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tasks: true,
        teacher: true,
      },
    })
  },
  ['course'],
  {
    revalidate: 3600, // 1小时后重新验证
    tags: ['course'],
  }
)

export const getCachedUserProgress = unstable_cache(
  async (userId: string, courseId: string) => {
    // 获取用户进度
    return await prisma.studentCourses.findUnique({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId: courseId,
        },
      },
    })
  },
  ['user-progress'],
  {
    revalidate: 60, // 1分钟后重新验证
    tags: ['progress'],
  }
) 