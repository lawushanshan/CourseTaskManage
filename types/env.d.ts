declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    EMAIL_SERVER_HOST?: string
    EMAIL_SERVER_PORT?: string
    EMAIL_SERVER_USER?: string
    EMAIL_SERVER_PASSWORD?: string
    EMAIL_FROM?: string
    CLOUDINARY_CLOUD_NAME?: string
    CLOUDINARY_API_KEY?: string
    CLOUDINARY_API_SECRET?: string
    SENTRY_DSN?: string
  }
} 