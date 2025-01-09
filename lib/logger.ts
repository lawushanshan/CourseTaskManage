import pino from 'pino'
import { createWriteStream } from 'pino-http-send'

// 创建日志写入流
const streams = [
  { stream: process.stdout },  // 控制台输出
  createWriteStream({
    url: '/api/logs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
]

// 创建日志记录器
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
}, pino.multistream(streams))

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