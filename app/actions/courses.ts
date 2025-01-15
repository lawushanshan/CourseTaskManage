'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseFormData } from '@/types/course'
import { CourseStatus } from '@prisma/client'

export async function createCourse(data: CourseFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.roles?.includes('TEACHER')) {
    throw new Error('Unauthorized')
  }

  try {
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        status: CourseStatus.DRAFT,
        teacherId: session.user.id,
        price: data.price || 0,
        coverImage: data.coverImage || null,
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
    })
    
    return course
  } catch (error) {
    console.error('Create course error:', error)
    throw new Error('创建课程失败')
  }
}

export async function updateCourse(id: string, data: CourseFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.roles?.includes('TEACHER')) {
    throw new Error('Unauthorized')
  }

  try {
    const course = await prisma.course.update({
      where: {
        id,
        teacherId: session.user.id,
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        price: data.price || 0,
        coverImage: data.coverImage || null,
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
    })
    
    return course
  } catch (error) {
    console.error('Update course error:', error)
    throw new Error('更新课程失败')
  }
} 