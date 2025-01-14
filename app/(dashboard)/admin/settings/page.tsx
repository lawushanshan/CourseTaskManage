import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SystemSettings } from '@/components/admin/system-settings'

export const metadata: Metadata = {
  title: '系统设置 | EduFlow',
  description: '管理系统配置',
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user.isAdmin) {
    redirect('/dashboard')
  }

  const settings = await prisma.systemSetting.findFirst()

  return (
    <div className="container py-10">
      <SystemSettings initialData={settings} />
    </div>
  )
} 