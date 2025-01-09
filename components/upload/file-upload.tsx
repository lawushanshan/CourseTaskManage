'use client'

import { useState } from 'react'
import { Upload, message, Button, Progress } from 'antd'
import { UploadOutlined, FileOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useSession } from 'next-auth/react'

interface FileUploadProps {
  maxSize?: number // MB
  accept?: string
  multiple?: boolean
  onUpload?: (urls: string[]) => void
  maxCount?: number
  listType?: 'text' | 'picture' | 'picture-card'
}

export function FileUpload({
  maxSize = 5,
  accept,
  multiple = false,
  onUpload,
  maxCount = 1,
  listType = 'text'
}: FileUploadProps) {
  const { data: session } = useSession()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const props: UploadProps = {
    name: 'file',
    multiple,
    maxCount,
    accept,
    listType,
    fileList,
    beforeUpload: (file) => {
      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        message.error(`文件大小不能超过 ${maxSize}MB!`)
        return Upload.LIST_IGNORE
      }
      return true
    },
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      const formData = new FormData()
      formData.append('file', file as File)

      try {
        setUploading(true)
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('上传失败')
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || '上传失败')
        }

        onSuccess?.(data.data)
        onUpload?.([data.data.url])
        message.success('上传成功')
      } catch (error) {
        console.error('Upload error:', error)
        onError?.(error as Error)
        message.error('上传失败')
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    onChange: ({ fileList: newFileList, file }) => {
      setFileList(newFileList)
      // 更新上传进度
      if (file.status === 'uploading' && file.percent) {
        setProgress(Math.round(file.percent))
      }
    },
    onRemove: (file) => {
      // 如果文件已上传，调用删除API
      if (file.url) {
        fetch('/api/upload', {
          method: 'DELETE',
          body: JSON.stringify({ url: file.url }),
        })
      }
    },
  }

  return (
    <div className="space-y-4">
      <Upload {...props}>
        <Button icon={<UploadOutlined />} loading={uploading}>
          选择文件
        </Button>
      </Upload>
      {progress > 0 && progress < 100 && (
        <Progress percent={progress} size="small" />
      )}
    </div>
  )
} 