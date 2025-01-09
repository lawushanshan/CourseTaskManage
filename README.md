# EduFlow - 在线教育任务管理系统

EduFlow 是一个专注于在线教育任务管理的平台，支持教师创建课程、管理任务，学生参与学习并进行互动。

## 主要功能

### 1. 课程管理

- 创建和编辑课程（包含课程名称、学习目标、环境要求等）
- 创建和排序任务
- 为任务创建详细步骤
- 支持富文本和 Markdown 编辑
- 支持图片和视频外链
- 设置任务完成期限

### 2. 课程参与

- 通过链接分享和加入课程
- 自动继承课程任务和步骤
- 支持加入多个课程
- 实时进度跟踪

### 3. 任务完成与评价

- 标记步骤完成状态
- 自动更新任务完成进度
- 课程完成状态追踪
- 多维度评价系统

### 4. 互动与反馈

- 步骤评论功能
- 实时通知系统
- 任务评价
- 课程五星评分
- 学习心得分享

### 5. 教师功能

- 查看和回复评论
- 课程上下架管理
- 学习进度监控
- 任务完成评价
- 学生管理

### 6. 系统功能

- 用户注册和登录
- 角色权限管理
- 系统监控和日志
- 数据备份和恢复
- 系统设置管理

## 技术栈

- 前端：Next.js 14, React, TypeScript, Tailwind CSS, Ant Design
- 后端：Next.js API Routes, Prisma ORM
- 数据库：PostgreSQL
- 认证：NextAuth.js
- 部署：Vercel

## 开发环境设置

1. 克隆仓库
   bash
   git clone <repository-url>
   cd eduflow

2. 安装依赖
   bash
   npm install

3. 环境变量配置
   复制`.env.example`到`.env`并配置必要的环境变量：
   bash
   cp .env.example .env

4. 数据库迁移
   npx prisma migrate dev

5. 启动开发服务器
   npm run dev

## 部署

1. 构建项目
   npm run build
2. 启动生产服务器
   npm start

## 本地开发

### 环境要求

- Node.js 18+
- Docker
- PostgreSQL (通过 Docker 提供)

### 启动步骤

1. 克隆项目
   git clone https://github.com/your-username/eduflow.git
   cd eduflow
2. 复制环境配置文件
   cp .env.example .env.local
3. 运行开发环境设置脚本
   chmod +x scripts/dev-setup.sh
4. 启动开发服务器
   npm run dev
5. 访问应用
   打开 http://localhost:3000

### 测试账号

- 管理员: admin@eduflow.com / admin123
- 教师: teacher@eduflow.com / teacher123
- 学生: student@eduflow.com / student123

### 开发工具

- Prisma Studio: `npm run prisma:studio`
- 数据库重置: `npm run prisma:reset`
- 代码检查: `npm run lint`

## 系统维护

### 备份

系统支持自动和手动备份：

- 自动备份：每日凌晨自动执行
- 手动备份：通过管理面板触发

### 监控

- 系统性能监控
- 用户行为日志
- 错误追踪
- 资源使用统计

### 安全

- 角色基础访问控制
- API 请求验证
- 数据加密存储
- 防 SQL 注入

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)
