@echo off
chcp 65001 >nul
title 高考语文复习计划 - APK 构建工具
echo ============================================
echo   高考语文复习计划 - APK 构建工具
echo ============================================
echo.

:: Check Java
echo [1/4] 检查 Java 环境...
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] 未安装 Java！请安装 JDK 17+
    echo    下载: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)
java -version 2>&1 | findstr /i "version" | findstr /i "17 18 19 20 21 22 23 24 25"
if %ERRORLEVEL% NEQ 0 (
    echo [!] 需要 JDK 17 或更高版本！
    echo    当前 Java 版本：
    java -version
    pause
    exit /b 1
)
echo [OK] Java 环境就绪

:: Check Android SDK
echo [2/4] 检查 Android SDK...
if "%ANDROID_HOME%"=="" (
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
    ) else (
        echo [!] 未找到 Android SDK！
        echo    请安装 Android Studio 或命令行工具
        echo    1. 下载命令行工具: https://developer.android.com/studio#command-line-tools-only
        echo    2. 解压到 C:\Android\cmdline-tools
        echo    3. 运行: sdkmanager "platforms;android-35" "build-tools;35.0.0"
        echo    4. 设置环境变量 ANDROID_HOME=C:\Android
        pause
        exit /b 1
    )
)
echo [OK] Android SDK: %ANDROID_HOME%

:: Sync web assets
echo [3/4] 同步网页资源到 Android 项目...
cd /d "%~dp0"
call npm run sync 2>nul
if %ERRORLEVEL% NEQ 0 (
    call cap.cmd sync
)
echo [OK] 资源同步完成

:: Build APK
echo [4/4] 构建 APK（首次编译需要下载 Gradle，较慢）...
cd /d "%~dp0android"
call gradlew.bat assembleDebug --no-daemon
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo   APK 构建成功！
    echo ============================================
    echo   输出路径:
    echo   %~dp0android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo   安装方法:
    echo   1. 将 APK 文件传到手机
    echo   2. 在手机上打开文件管理器，点击 APK 安装
    echo   3. 如果提示"未知来源"，请在设置中允许
    echo.
) else (
    echo [!] 构建失败，请检查错误信息
)
pause
