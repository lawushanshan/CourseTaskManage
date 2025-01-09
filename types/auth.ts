import { Role } from '@prisma/client'

export interface UserPermissions {
  canManageUsers: boolean
  canManageCourses: boolean
  canManageSettings: boolean
  canViewAnalytics: boolean
  canTeachCourses: boolean
  canEnrollCourses: boolean
}

export const DEFAULT_PERMISSIONS: Record<Role, UserPermissions> = {
  ADMIN: {
    canManageUsers: true,
    canManageCourses: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canTeachCourses: true,
    canEnrollCourses: true,
  },
  TEACHER: {
    canManageUsers: false,
    canManageCourses: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canTeachCourses: true,
    canEnrollCourses: true,
  },
  STUDENT: {
    canManageUsers: false,
    canManageCourses: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canTeachCourses: false,
    canEnrollCourses: true,
  },
}

export function getUserPermissions(roles: Role[]): UserPermissions {
  const permissions: UserPermissions = {
    canManageUsers: false,
    canManageCourses: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canTeachCourses: false,
    canEnrollCourses: false,
  }

  roles.forEach(role => {
    const rolePermissions = DEFAULT_PERMISSIONS[role]
    Object.keys(rolePermissions).forEach(key => {
      permissions[key as keyof UserPermissions] ||= rolePermissions[key as keyof UserPermissions]
    })
  })

  return permissions
} 