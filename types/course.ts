import { CourseStatus } from '@prisma/client'
import { COURSE_LEVELS } from '@/constants/enums'

export type CourseLevel = typeof COURSE_LEVELS[keyof typeof COURSE_LEVELS]

export interface CourseFormData {
  id?: string
  title: string
  description: string
  category: string
  level: CourseLevel
  price?: number
  coverImage?: string | null
  status?: CourseStatus
} 