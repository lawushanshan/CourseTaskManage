import { cn } from '@/lib/utils'

interface LoadingStateProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

export function LoadingState({ className, size = 'md' }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <div className={cn(
        "animate-spin rounded-full border-b-2 border-primary",
        sizeClasses[size]
      )} />
    </div>
  )
} 