import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserManagement } from '@/components/admin/user-management'

export const metadata: Metadata = {
  title: '用户管理 | EduFlow',
  description: '管理系统用户',
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          enrolledCourses: true,
          completedSteps: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container py-10">
      <UserManagement users={users} />
    </div>
  )
} 