import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const userId = session.user.id

    // 获取用户的学习数据
    const [
      completedSteps,
      totalSteps,
      courseCategories,
      levelPerformance
    ] = await Promise.all([
      // 已完成步骤数
      prisma.stepCompletion.count({
        where: { studentId: userId }
      }),
      // 总步骤数
      prisma.step.count({
        where: {
          task: {
            course: {
              students: {
                some: { id: userId }
              }
            }
          }
        }
      }),
      // 课程分类分布
      prisma.course.groupBy({
        by: ['category'],
        where: {
          students: {
            some: { id: userId }
          }
        },
        _count: true
      }),
      // 不同难度的表现
      prisma.course.groupBy({
        by: ['level'],
        where: {
          students: {
            some: { id: userId }
          }
        },
        _avg: {
          rating: true
        },
        _count: true
      })
    ])

    // 获取每日进度数据
    const dailyProgress = await prisma.stepCompletion.groupBy({
      by: ['completedAt'],
      where: {
        studentId: userId,
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 最近30天
        }
      },
      _count: true
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        totalTime: completedSteps * 30, // 假设每个步骤平均花费30分钟
        completedTasks: completedSteps,
        totalTasks: totalSteps,
        dailyProgress: dailyProgress.map(dp => ({
          date: dp.completedAt.toISOString().split('T')[0],
          minutes: dp._count * 30,
          completedSteps: dp._count
        })),
        categoryDistribution: courseCategories.map(cc => ({
          category: cc.category,
          count: cc._count
        })),
        performanceByLevel: levelPerformance.map(lp => ({
          level: lp.level,
          avgScore: Math.round((lp._avg.rating || 0) * 20), // 转换为百分制
          totalCourses: lp._count
        }))
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 