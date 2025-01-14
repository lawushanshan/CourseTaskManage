import { prisma } from './prisma'
import { log } from './logger'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface BackupOptions {
  includeFiles?: boolean
  compress?: boolean
}

export async function createBackup(options: BackupOptions = {}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = join(process.cwd(), 'backups', timestamp)

  try {
    // 备份数据库
    const dbBackup = await backupDatabase()
    await writeFile(
      join(backupDir, 'database.json'),
      JSON.stringify(dbBackup, null, 2)
    )

    // 备份上传的文件
    if (options.includeFiles) {
      await backupFiles(backupDir)
    }

    // 压缩备份
    if (options.compress) {
      await compressBackup(backupDir, timestamp)
    }

    log('info', 'Backup created successfully', { timestamp })
    return { success: true, timestamp }
  } catch (error) {
    log('error', 'Backup failed', { error })
    throw error
  }
}

async function backupDatabase() {
  // 获取所有表的数据
  const tables = [
    'User',
    'Course',
    'Task',
    'Step',
    'Comment',
    'Rating',
    'SystemSetting',
    'SystemLog',
    'Notification',
  ]

  const backup: Record<string, any> = {}

  for (const table of tables) {
    backup[table] = await prisma[table.toLowerCase()].findMany()
  }

  return backup
}

async function backupFiles(backupDir: string) {
  const uploadsDir = join(process.cwd(), 'public/uploads')
  await execAsync(`cp -r ${uploadsDir} ${backupDir}/uploads`)
}

async function compressBackup(backupDir: string, timestamp: string) {
  await execAsync(`tar -czf backups/${timestamp}.tar.gz -C backups ${timestamp}`)
  await execAsync(`rm -rf ${backupDir}`)
}

export async function restoreBackup(timestamp: string) {
  try {
    // 解压备份
    await execAsync(`tar -xzf backups/${timestamp}.tar.gz -C backups`)
    const backupDir = join(process.cwd(), 'backups', timestamp)

    // 恢复数据库
    const dbBackup = require(join(backupDir, 'database.json'))
    await restoreDatabase(dbBackup)

    // 恢复文件
    if (await fileExists(join(backupDir, 'uploads'))) {
      await execAsync(`cp -r ${backupDir}/uploads/* public/uploads/`)
    }

    log('info', 'Backup restored successfully', { timestamp })
    return { success: true }
  } catch (error) {
    log('error', 'Restore failed', { error })
    throw error
  }
}

async function restoreDatabase(backup: Record<string, any[]>) {
  // 按依赖顺序恢复数据
  const order = [
    'User',
    'Course',
    'Task',
    'Step',
    'Comment',
    'Rating',
    'SystemSetting',
    'SystemLog',
    'Notification',
  ]

  for (const table of order) {
    if (backup[table]) {
      await prisma[table.toLowerCase()].createMany({
        data: backup[table],
        skipDuplicates: true,
      })
    }
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
} 