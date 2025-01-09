export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface User {
  id: string
  name: string
  email: string
  roles: UserRole[]
  isActive: boolean
  createdAt: Date
  teachingCourses?: Course[]
  enrolledCourses?: Course[]
}

export interface Course {
  id: string
  title: string
  description: string
  coverImage?: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  price: number
  teacherId: string
  teacher: User
  students: User[]
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

export interface SystemSetting {
  id: string
  siteName: string
  siteDescription: string
  maxUploadSize: number
  allowRegistration: boolean
  maintenanceMode: boolean
  allowMultipleRoles: boolean
  defaultUserRole: UserRole
  updatedAt: Date
}

export interface Task {
  id: string
  courseId: string
  title: string
  description: string
  orderIndex: number
  expectedCompletionDate: Date
  steps: Step[]
  createdAt: Date
}

export interface Step {
  id: string
  taskId: string
  title: string
  content: string
  orderIndex: number
  contentType: 'text' | 'markdown' | 'video' | 'quiz'
  resources: string[]
  createdAt: Date
} 