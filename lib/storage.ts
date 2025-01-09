import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads')

// S3客户端配置
const s3Client = new S3Client({
  region: process.env.S3_REGION || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
})

interface StorageOptions {
  type?: 'local' | 's3'
}

export class Storage {
  private type: 'local' | 's3'

  constructor(options: StorageOptions = {}) {
    this.type = options.type || process.env.STORAGE_TYPE as 'local' | 's3' || 'local'
  }

  async upload(file: Buffer, fileName: string): Promise<string> {
    if (this.type === 's3') {
      return this.uploadToS3(file, fileName)
    }
    return this.uploadToLocal(file, fileName)
  }

  async delete(url: string): Promise<void> {
    if (this.type === 's3') {
      return this.deleteFromS3(url)
    }
    return this.deleteFromLocal(url)
  }

  private async uploadToLocal(file: Buffer, originalName: string): Promise<string> {
    const ext = originalName.split('.').pop()
    const fileName = `${nanoid()}.${ext}`
    const filePath = join(UPLOAD_DIR, fileName)

    await writeFile(filePath, file)
    return `/uploads/${fileName}`
  }

  private async deleteFromLocal(url: string): Promise<void> {
    const fileName = url.split('/').pop()
    if (!fileName) throw new Error('Invalid URL')
    
    const filePath = join(UPLOAD_DIR, fileName)
    await unlink(filePath)
  }

  private async uploadToS3(file: Buffer, originalName: string): Promise<string> {
    const ext = originalName.split('.').pop()
    const fileName = `${nanoid()}.${ext}`

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: file,
      ContentType: this.getContentType(ext),
    }))

    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`
  }

  private async deleteFromS3(url: string): Promise<void> {
    const fileName = url.split('/').pop()
    if (!fileName) throw new Error('Invalid URL')

    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
    }))
  }

  private getContentType(ext?: string): string {
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    return mimeTypes[ext?.toLowerCase() || ''] || 'application/octet-stream'
  }
}

export const storage = new Storage() 