'use client'

import { useEffect } from 'react'

interface SessionDebugProps {
  session: any
  isTeacher: boolean
  children: React.ReactNode
}

export function SessionDebug({ session, isTeacher, children }: SessionDebugProps) {
  useEffect(() => {
    console.log('=== Client Debug Info ===')
    console.log('Session:', session)
    console.log('Is teacher:', isTeacher)
  }, [session, isTeacher])

  return <>{children}</>
} 