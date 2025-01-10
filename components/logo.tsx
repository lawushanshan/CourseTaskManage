'use client'

import Image from 'next/image'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  theme?: 'light' | 'dark'
}

export function Logo({ size = 'medium', theme = 'light' }: LogoProps) {
  const sizes = {
    small: { width: 120, height: 40 },
    medium: { width: 160, height: 53 },
    large: { width: 200, height: 66 }
  }

  return (
    <div className="logo-container">
      <Image
        src={`/images/logo-${theme}.svg`}
        alt="EduFlow Logo"
        {...sizes[size]}
        priority
        className="logo-image"
      />
      <style jsx>{`
        .logo-container {
          display: inline-flex;
          align-items: center;
        }
        .logo-image {
          height: auto;
          object-fit: contain;
        }
      `}</style>
    </div>
  )
} 