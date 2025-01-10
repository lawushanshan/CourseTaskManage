@echo off
setlocal enabledelayedexpansion

:: 切换到项目根目录
cd /d %~dp0\..

:: 检查必要的工具
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker installation required
    exit /b 1
)

:: 复制环境变量文件
echo Setting up environment variables...
if not exist ".env.local" (
    copy .env.example .env.local
    echo .env.local created from example
)

:: 等待一下确保文件被正确创建
timeout /t 2 /nobreak

:: 验证环境变量文件是否存在
if not exist ".env.local" (
    echo Error: .env.local file not created!
    exit /b 1
)

:: 显示当前的数据库连接字符串
echo Checking database connection string...
findstr "DATABASE_URL" .env.local
if %ERRORLEVEL% neq 0 (
    echo Error: DATABASE_URL not found in .env.local
    exit /b 1
)

:: 启动 PostgreSQL
echo Starting PostgreSQL...
docker run --name eduflow-postgres ^
    -e POSTGRES_PASSWORD=postgres ^
    -e POSTGRES_DB=eduflow ^
    -p 5432:5432 ^
    -d postgres:14-alpine

:: 等待数据库启动
echo Waiting for database to start...
timeout /t 5 /nobreak

:: 安装依赖
echo Installing dependencies...
call cnpm install

:: 生成 Prisma 客户端
echo Generating Prisma client...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduflow
call npx prisma generate --schema ./prisma/schema.prisma

:: 推送数据库架构
echo Pushing database schema...
call npx prisma db push --schema ./prisma/schema.prisma --accept-data-loss

:: 初始化数据库
echo Initializing database...
call npx ts-node --project scripts/tsconfig.json scripts/init-db.ts

:: 创建上传目录
echo Creating uploads directory...
if not exist "public\uploads" mkdir "public\uploads"

echo First-time setup complete! 