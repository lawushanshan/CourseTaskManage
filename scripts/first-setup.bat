@echo off
setlocal enabledelayedexpansion

:: 切换到项目根目录
cd /d %~dp0\..

:: 检查必要的工具
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH
    exit /b 1
)

:: 复制环境变量文件
echo [INFO] Setting up environment variables...
if not exist ".env.local" (
    copy .env.example .env.local
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Failed to create .env.local
        exit /b 1
    )
    echo [SUCCESS] .env.local created from example
)

:: 等待确保文件被正确创建
timeout /t 2 /nobreak >nul

:: 停止并删除旧的 Docker 容器（如果存在）
echo [INFO] Cleaning up old Docker containers...
docker stop eduflow-postgres 2>nul
docker rm eduflow-postgres 2>nul

:: 启动 PostgreSQL
echo [INFO] Starting PostgreSQL...
docker run --name eduflow-postgres ^
    -e POSTGRES_PASSWORD=postgres ^
    -e POSTGRES_DB=eduflow ^
    -p 5432:5432 ^
    -d postgres:14-alpine

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to start PostgreSQL container
    exit /b 1
)

:: 等待数据库启动
echo [INFO] Waiting for database to start...
timeout /t 10 /nobreak >nul

:: 设置数据库连接字符串
echo [INFO] Setting up database connection...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduflow
echo [SUCCESS] Database URL set to: %DATABASE_URL%

:: 安装依赖
echo [INFO] Installing dependencies...
call cnpm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

:: 生成 Prisma 客户端
echo [INFO] Generating Prisma client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to generate Prisma client
    exit /b 1
)

:: 推送数据库架构
echo [INFO] Pushing database schema...
call npx prisma db push --accept-data-loss
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to push database schema
    exit /b 1
)

:: 初始化数据库
echo [INFO] Initializing database...
call npx ts-node --project scripts/tsconfig.json scripts/init-db.ts
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to initialize database
    exit /b 1
)

:: 运行种子数据脚本
echo [INFO] Running seed data...
call npx prisma db seed
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to seed database
    exit /b 1
)

:: 创建上传目录
echo [INFO] Creating uploads directory...
if not exist "public\uploads" mkdir "public\uploads"

echo [SUCCESS] First-time setup completed successfully!
echo.
echo You can now start the development server with: npm run dev
echo.
echo Test accounts:
echo - Admin: admin@eduflow.com / admin123
echo - Teacher: teacher@eduflow.com / teacher123
echo - Student: student@eduflow.com / student123

pause 