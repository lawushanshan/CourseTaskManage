import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'
import { ApiResponse } from '@/types'
import { log } from '@/lib/logger'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '没有找到文件'
      }, { status: 400 })
    }

    // 检查文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '文件大小超过限制'
      }, { status: 400 })
    }

    // 生成安全的文件名
    const ext = file.name.split('.').pop()
    const fileName = `${nanoid()}.${ext}`
    const filePath = join(UPLOAD_DIR, fileName)

    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // 记录上传日志
    log('info', 'File uploaded', {
      userId: session.user.id,
      fileName,
      size: file.size,
      type: file.type,
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        url: `/uploads/${fileName}`,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少文件URL'
      }, { status: 400 })
    }

    // 从URL中提取文件名
    const fileName = url.split('/').pop()
    const filePath = join(UPLOAD_DIR, fileName)

    // 删除文件
    await unlink(filePath)

    // 记录删除日志
    log('info', 'File deleted', {
      userId: session.user.id,
      fileName,
    })

    return NextResponse.json<ApiResponse>({
      success: true
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 