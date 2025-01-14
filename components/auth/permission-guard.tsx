'use client'

import { useSession } from 'next-auth/react'
import { Role, getUserPermissions, type UserPermissions } from '@/types/auth'
import { Alert } from 'antd'

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermission?: keyof UserPermissions
  requiredRole?: Role
  fallback?: React.ReactNode
}

export function PermissionGuard({
  children,
  requiredPermission,
  requiredRole,
  fallback = <Alert type="error" message="您没有权限访问此内容" />,
}: PermissionGuardProps) {
  const { data: session } = useSession()
  const roles = session?.user?.roles || []
  const permissions = getUserPermissions(roles)

  if (requiredRole && !roles.includes(requiredRole)) {
    return fallback
  }

  if (requiredPermission && !permissions[requiredPermission]) {
    return fallback
  }

  return <>{children}</>
} 