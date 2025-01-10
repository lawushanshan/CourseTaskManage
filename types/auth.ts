export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageCourses: boolean;
  canTeach: boolean;
  canEnroll: boolean;
  canComment: boolean;
  canRate: boolean;
}

export function getUserPermissions(roles: Role[]): UserPermissions {
  return {
    canManageUsers: roles.includes(Role.ADMIN),
    canManageCourses: roles.includes(Role.ADMIN) || roles.includes(Role.TEACHER),
    canTeach: roles.includes(Role.TEACHER),
    canEnroll: roles.includes(Role.STUDENT),
    canComment: true,
    canRate: roles.includes(Role.STUDENT),
  };
} 