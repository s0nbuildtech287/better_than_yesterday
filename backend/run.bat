@echo off
chcp 65001 >nul
title Better Than Yesterday - Java Backend (Spring Boot 3)
echo =======================================================
echo 🚀 Khởi động Java Spring Boot Backend (Port 8080)...
echo =======================================================
cd /d "%~dp0"
call gradlew.bat bootRun
pause

