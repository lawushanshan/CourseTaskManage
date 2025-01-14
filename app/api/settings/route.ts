import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/types/api'

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findFirst()
    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.isAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const settings = await prisma.systemSetting.upsert({
      where: {
        id: '1', // 只保存一条记录
      },
      update: body,
      create: {
        id: '1',
        ...body,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 