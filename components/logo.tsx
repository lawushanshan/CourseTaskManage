'use client'

interface LogoProps {
  size?: 'small' | 'default'
  theme?: 'light' | 'dark'
}

export function Logo({ size = 'default', theme = 'light' }: LogoProps) {
  const fontSize = size === 'small' ? '18px' : '24px'
  const color = theme === 'dark' ? '#fff' : '#1890ff'

  return (
    <div 
      className="flex items-center"
      style={{ fontSize, color }}
    >
      <img 
        src="/logo.svg" 
        alt="EduFlow" 
        className={`mr-2 ${size === 'small' ? 'h-8 w-8' : 'h-10 w-10'}`}
      />
      <span className="font-semibold">EduFlow</span>
    </div>
  )
} 