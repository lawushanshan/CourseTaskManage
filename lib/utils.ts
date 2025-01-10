export const isServer = typeof window === 'undefined'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num)
} 