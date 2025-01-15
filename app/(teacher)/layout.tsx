import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.roles?.includes('TEACHER')) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        {children}
      </main>
    </div>
  )
} 