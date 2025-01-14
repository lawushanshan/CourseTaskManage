import { HomeContainer } from '@/components/home/home-container'
import { Metadata } from 'next'
import '@/styles/home.css'

export const metadata: Metadata = {
  title: 'EduFlow - 在线教育平台',
  description: '专业的在线学习平台，随时随地开启您的学习之旅',
}

export default function HomePage() {
  return <HomeContainer />
} 