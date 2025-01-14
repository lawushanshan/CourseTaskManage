export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    }
  }

  console.error(error)
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
  }
} 