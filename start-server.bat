@echo off
chcp 65001 >nul
title 高考语文复习计划 - 本地服务器
echo ============================================
echo   高考语文复习计划 - 本地服务器
echo ============================================
echo.
echo 启动本地 HTTP 服务器...
echo.
echo 手机连接同一 WiFi 后，在浏览器中访问:
echo.
ipconfig | findstr /i "IPv4"
echo  :8900
echo.
echo 例如: http://192.168.1.100:8900
echo.
echo 在 Chrome 浏览器中打开后，可以"添加到主屏幕"
echo 以获得近似原生应用的体验！
echo.
echo 按 Ctrl+C 停止服务器
echo ============================================
echo.

cd /d "%~dp0"
python -m http.server 8900
pause
