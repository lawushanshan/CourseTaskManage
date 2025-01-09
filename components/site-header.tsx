import Link from 'next/link'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function SiteHeader() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {session ? (
              <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
                仪表板
              </Link>
            ) : (
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                登录
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 