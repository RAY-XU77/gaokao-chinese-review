# 高考语文复习计划 App

## 目标
通过系统训练，将高考语文成绩提升至 **125分/150分**（正确率 83%）。

## 适用
- **考试**：2025-2027 新课标 I/II 卷（全国卷）
- **形式**：纯前端 Web App + PWA 支持 + Android APK

## 功能
1. **专项训练** — 10 大题型分难度练习（基础/进阶/冲刺）
2. **模拟考试** — 150 分钟限时模考，自动评分
3. **错题本** — 自动收录错题，标记掌握状态
4. **成绩分析** — 模块得分率雷达图，定位薄弱环节
5. **学习记录** — 日历视图，追踪每日学习数据

## 10 大模块
| 编号 | 模块 | 题量 |
|------|------|------|
| 01 | 信息类文本阅读 | 40 题 |
| 02 | 文学类文本阅读 | 40 题 |
| 03 | 文言文阅读 | 50 题 |
| 04 | 古代诗歌阅读 | 40 题 |
| 05 | 名篇名句默写 | 200 句 |
| 06 | 成语/词语运用 | 60 题 |
| 07 | 病句修改 | 60 题 |
| 08 | 语句衔接与补写 | 50 题 |
| 09 | 修辞/句式/压缩 | 50 题 |
| 10 | 写作 | 30 题 |
| **合计** | | **约 620 题** |

---

## 安装到手机的方式（三种方案）

### 方案一：PWA 安装（最简单，推荐）
PWA（Progressive Web App）可以像原生 App 一样安装到手机主屏幕。

**步骤：**
1. 在电脑上启动本地服务器：双击 **`start-server.bat`**
2. 确保手机和电脑连接同一个 WiFi
3. 在手机 Chrome 浏览器中访问显示的地址（如 `http://192.168.1.100:8900`）
4. 打开后，Chrome 会提示"添加到主屏幕"（或点击菜单 → 添加到主屏幕）
5. 安装后会在桌面生成图标，像原生 App 一样使用

**优点：**
- 无需安装任何工具
- 支持离线使用
- 占用空间极小
- 自动更新

### 方案二：Android APK（原生应用）
生成一个真正的 .apk 安装包，直接传到手机安装。

**前提条件（首次构建需安装）：**
- JDK 17+（推荐 Temurin: https://adoptium.net/temurin/releases/?version=17）
- Android Studio 或 Android 命令行工具
  - 下载命令行工具: https://developer.android.com/studio#command-line-tools-only
  - 解压到 `C:\Android\cmdline-tools`
  - 运行: `sdkmanager "platforms;android-35" "build-tools;35.0.0"`
  - 设置环境变量 `ANDROID_HOME=C:\Android`

**构建步骤：**
1. 双击 **`build-apk.bat`** 一键构建
2. 构建完成后 APK 位于：`android\app\build\outputs\apk\debug\app-debug.apk`
3. 将 APK 传到手机，点击安装
4. 如果提示"未知来源"，在设置中允许安装未知来源应用

**手动构建（如果一键脚本失败）：**
```bash
# 同步网页资源
npm run sync
# 或
cap.cmd sync

# 构建 APK
cd android
gradlew.bat assembleDebug
```

### 方案三：在线云打包（无需安装 JDK/Android SDK）
推荐国内开发者使用 DCloud HBuilder 的云打包服务：
1. 注册 DCloud 账号: https://dev.dcloud.net.cn
2. 在 HBuilder 中新建"Wap2App"项目
3. 将本项目的 index.html 作为启动页
4. 使用"云打包"功能生成 APK

也可以使用 PWA Builder 在线工具:
- 访问 https://pwabuilder.com
- 输入部署后的网站地址
- 生成 Android APK

---

## 技术栈
- 纯 HTML + CSS + JavaScript
- 无构建步骤，无外部依赖
- 数据存储在浏览器 localStorage
- PWA 支持离线使用和安装
- Capacitor 提供原生 Android 包装

## 项目结构
```
高考语文复习计划/
├── index.html          # 主页面
├── manifest.json       # PWA 清单
├── sw.js               # Service Worker
├── css/                # 样式文件
├── js/                 # JavaScript 逻辑
│   ├── data/           # 题库数据 (10 个模块)
│   └── views/          # 页面视图
├── assets/             # 图标资源
├── www/                # Capacitor Web 目录
├── android/            # Android 原生项目 (Capacitor)
├── build-apk.bat       # APK 构建脚本
├── start-server.bat    # 本地服务器脚本
├── package.json        # Node 配置
└── capacitor.config.json # Capacitor 配置
```

## 本地开发
1. 直接双击 `index.html` 即可使用
2. 或部署到任何静态服务器
3. 无需网络连接，离线可用

## 说明
- 所有数据保存在浏览器本地，清除浏览器数据会丢失学习记录
- 建议定期备份 localStorage 数据
- 支持所有现代浏览器（Chrome、Edge、Safari 等）
