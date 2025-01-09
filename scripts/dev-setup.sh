#!/bin/bash

# 检查必要的工具
command -v docker >/dev/null 2>&1 || { echo "需要安装 Docker"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "需要安装 Node.js"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "需要安装 npm"; exit 1; }

# 启动 PostgreSQL
docker run --name eduflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=eduflow \
  -p 5432:5432 \
  -d postgres:14

# 等待数据库启动
echo "等待数据库启动..."
sleep 5

# 安装依赖
npm install

# 生成 Prisma 客户端
npm run prisma:generate

# 推送数据库架构
npm run prisma:push

# 初始化数据库
npx ts-node scripts/init-db.ts

# 创建上传目录
mkdir -p public/uploads

echo "开发环境设置完成!" 