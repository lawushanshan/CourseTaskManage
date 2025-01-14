import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { Role } from '@prisma/client'

// 权限检查函数类型
type PermissionChecker = (roles: Role[]) => Promise<boolean>

// 检查用户是否有指定角色
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user.roles) return false
  return session.user.roles.includes(requiredRole)
}

// 检查用户是否有任意指定角色
export async function hasAnyRole(requiredRoles: Role[]): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user.roles) return false
  return requiredRoles.some(role => session.user.roles.includes(role))
}

// 检查用户是否有所有指定角色
export async function hasAllRoles(requiredRoles: Role[]): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user.roles) return false
  return requiredRoles.every(role => session.user.roles.includes(role))
}

// 检查用户是否是课程的教师
export async function isTeacherOfCourse(courseId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) return false

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true },
  })

  return course?.teacherId === session.user.id
}

// 检查用户是否是课程的学生
export async function isStudentOfCourse(courseId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) return false

  const enrollment = await prisma.studentCourse.findUnique({
    where: {
      studentId_courseId: {
        studentId: session.user.id,
        courseId,
      },
    },
  })

  return !!enrollment
}

// API路由权限检查装饰器
export function withPermission(checker: PermissionChecker) {
  return async function(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user.roles) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hasPermission = await checker(session.user.roles)
    if (!hasPermission) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Forbidden'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return null // 继续处理请求
  }
}

// 使用示例：
// export const POST = withPermission(
//   async (roles) => roles.includes(Role.ADMIN)
// )(async (req) => {
//   // 处理请求
// }) 