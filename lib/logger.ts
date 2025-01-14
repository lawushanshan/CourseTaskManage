import { isServer } from '@/lib/utils'

// 客户端日志记录器
const clientLogger = {
  info: (data: any) => console.log(data),
  error: (data: any) => console.error(data),
  warn: (data: any) => console.warn(data),
  debug: (data: any) => console.debug(data),
}

let logger: any

if (isServer) {
  // 服务器端动态导入
  const pino = require('pino')
  
  // 创建日志记录器
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
  })
} else {
  logger = clientLogger
}

// 日志类型
export type LogLevel = 'info' | 'error' | 'warn' | 'debug'

// 日志记录函数
export function log(
  level: LogLevel,
  message: string,
  data?: Record<string, any>
) {
  logger[level]({
    timestamp: new Date().toISOString(),
    message,
    ...data,
  })
} 