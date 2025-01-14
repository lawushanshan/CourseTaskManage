declare module '@/types' {
  import { Role } from '@prisma/client'

  export interface User {
    id: string
    name: string
    email: string
    roles: Role[]
    isActive: boolean
    avatar?: string
  }

  export interface Course {
    id: string
    title: string
    description: string
    coverImage?: string
    level: string
    status: string
    price: number
    teacherId: string
    teacher: {
      name: string
    }
    _count?: {
      students: number
      tasks: number
      ratings: number
    }
    createdAt: string
    updatedAt: string
  }

  export interface Task {
    id: string
    courseId: string
    title: string
    description?: string
    orderIndex: number
    expectedCompletionDate?: string
    steps: Step[]
    _count?: {
      completedBy: number
    }
    createdAt: string
  }

  export interface Step {
    id: string
    taskId: string
    title: string
    content: string
    orderIndex: number
    contentType: string
    resources: string[]
    createdAt: string
  }

  export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
  }
} 