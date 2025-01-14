@echo off

:: 切换到项目根目录
cd /d %~dp0\..

:: 检查 PostgreSQL 容器是否运行
docker ps -q -f name=eduflow-postgres > temp.txt
set /p CONTAINER_ID=<temp.txt
del temp.txt

if "!CONTAINER_ID!"=="" (
    echo PostgreSQL container is not running, starting...
    docker start eduflow-postgres
    timeout /t 3 /nobreak
)

:: 启动开发服务器
echo Starting development server...
cnpm run dev 