# Appium 入门指南

## 一、Appium 是什么

[Appium](https://appium.io/) 是一个开源的跨平台移动端自动化测试框架，用于测试**原生应用（Native App）**、**混合应用（Hybrid App）** 和**移动端网页（Mobile Web）**。

核心特点：

- **跨平台**：同一套 API 可以测试 Android 和 iOS 应用
- **多语言支持**：测试脚本可以用 JavaScript、Python、Java、Ruby、C# 等多种语言编写
- **不需要修改 App**：基于标准的 WebDriver 协议，无需在被测应用中插入额外代码或 SDK
- **开源免费**：Apache 2.0 协议，社区活跃

## 二、核心架构

```
┌──────────────┐      HTTP/JSON      ┌─────────────────┐      ┌──────────────────┐
│  测试脚本     │  ──────────────────▶ │  Appium Server   │ ───▶ │  移动设备/模拟器   │
│  (客户端)     │  WebDriver Protocol │  (Node.js 服务)   │      │  (Android/iOS)   │
└──────────────┘                     └─────────────────┘      └──────────────────┘
                                            │
                                     ┌──────┴──────┐
                                     │   Drivers    │
                                     ├─────────────┤
                                     │ UiAutomator2│  ← Android
                                     │ XCUITest    │  ← iOS
                                     │ Espresso    │  ← Android
                                     │ Mac2        │  ← macOS
                                     │ Windows     │  ← Windows
                                     └─────────────┘
```

**Appium 2.x** 采用了插件化的 Driver 架构：
- `uiautomator2` — Android 测试的默认 Driver（基于 Google UiAutomator2）
- `xcuitest` — iOS 测试的默认 Driver（基于 Apple XCUITest）
- Driver 按需安装，不再内置

## 三、环境准备

### 3.1 基础依赖

| 依赖 | 说明 |
|------|------|
| **Node.js** ≥ 18 | Appium Server 运行环境 |
| **Java JDK** ≥ 11 | Android SDK 编译依赖 |
| **Android SDK** | 测试 Android 应用必需（推荐通过 Android Studio 安装） |
| **Xcode** | 测试 iOS 应用必需（仅 macOS） |

### 3.2 安装 Appium

```bash
# 全局安装 Appium 2.x
npm install -g appium

# 验证安装
appium --version

# 安装 Android Driver
appium driver install uiautomator2

# 安装 iOS Driver（仅 macOS）
appium driver install xcuitest

# 查看已安装的 Driver
appium driver list --installed
```

### 3.3 配置 Android 环境变量

```bash
# ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk        # Linux
# export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

### 3.4 环境检查工具

Appium 提供了 `appium-doctor` 来检查环境是否就绪：

```bash
npm install -g @appium/doctor
appium-doctor --android   # 检查 Android 环境
appium-doctor --ios       # 检查 iOS 环境
```

## 四、关键概念：Desired Capabilities

Desired Capabilities 是一组 JSON 键值对，告诉 Appium Server 你想要怎样的测试会话：

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel_7_API_34",
  "appium:app": "/path/to/your/app.apk",
  "appium:appPackage": "com.example.myapp",
  "appium:appActivity": "com.example.myapp.MainActivity",
  "appium:noReset": true
}
```

常用字段说明：

| 字段 | 说明 |
|------|------|
| `platformName` | 平台：`Android` 或 `iOS` |
| `appium:automationName` | 自动化引擎：`UiAutomator2`（Android）、`XCUITest`（iOS） |
| `appium:deviceName` | 设备名称（模拟器名称或真机 udid） |
| `appium:app` | APK/IPA 文件路径或下载 URL |
| `appium:appPackage` | Android 应用包名 |
| `appium:appActivity` | Android 启动 Activity |
| `appium:bundleId` | iOS 应用 Bundle ID |
| `appium:noReset` | `true` 表示不重置应用数据 |
| `appium:fullReset` | `true` 表示测试前卸载并重新安装应用 |

## 五、快速上手示例

本项目的 `tests/` 目录提供了可运行的示例代码。

### 5.1 项目初始化

```bash
cd appium-getting-started
npm install
```

### 5.2 启动 Appium Server

在另一个终端窗口中启动 Server：

```bash
appium
# 默认监听 http://localhost:4723
```

### 5.3 运行测试

```bash
# 运行 Android 示例
npx jest tests/android-basic.test.js

# 运行 iOS 示例（需要 macOS + Xcode）
npx jest tests/ios-basic.test.js
```

## 六、元素定位策略

Appium 支持多种方式定位页面元素：

| 策略 | 方法 | 示例 |
|------|------|------|
| **ID** | `findElement(By.id(...))` | `driver.findElement(By.id('com.example:id/login_btn'))` |
| **Accessibility ID** | `findElement(By.accessibilityId(...))` | 跨平台最佳实践 |
| **XPath** | `findElement(By.xpath(...))` | 灵活但性能较差 |
| **Class Name** | `findElement(By.className(...))` | `android.widget.Button` |
| **Android UIAutomator** | `findElement(By.androidUIAutomator(...))` | Android 专属，功能强大 |
| **iOS Predicate** | `findElement(By.iosPredicate(...))` | iOS 专属，性能好 |
| **iOS Class Chain** | `findElement(By.iosClassChain(...))` | iOS 专属，类似 XPath |

### 使用 Appium Inspector 辅助定位

[Appium Inspector](https://github.com/appium/appium-inspector) 是官方提供的 GUI 工具，可以：
- 可视化查看应用的 UI 层级结构
- 实时获取元素属性（ID、text、class 等）
- 录制定位表达式

下载地址：https://github.com/appium/appium-inspector/releases

## 七、常用操作 API

```javascript
// 点击
await element.click();

// 输入文本
await element.sendKeys('hello');

// 清除文本
await element.clear();

// 获取文本
const text = await element.getText();

// 获取属性
const enabled = await element.getAttribute('enabled');

// 判断是否显示
const visible = await element.isDisplayed();

// 滑动屏幕（使用 W3C Actions）
await driver.performActions([{
  type: 'pointer',
  id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x: 200, y: 800 },
    { type: 'pointerDown', button: 0 },
    { type: 'pointerMove', duration: 600, x: 200, y: 200 },
    { type: 'pointerUp', button: 0 },
  ],
}]);

// 截图
const screenshot = await driver.takeScreenshot(); // Base64

// 切换到 Webview 上下文（混合应用）
const contexts = await driver.getContexts();
await driver.switchContext(contexts[1]); // 切换到 WEBVIEW

// 切回原生上下文
await driver.switchContext('NATIVE_APP');

// 发送按键（Android）
await driver.pressKeyCode(4); // 返回键

// 安装/卸载应用
await driver.installApp('/path/to/app.apk');
await driver.removeApp('com.example.myapp');

// 将应用切到后台
await driver.background(5); // 后台 5 秒后恢复
```

## 八、测试框架集成

Appium 作为 WebDriver 的实现，可以和任何测试框架搭配：

| 语言 | 客户端库 | 常用测试框架 |
|------|---------|-------------|
| JavaScript | `webdriverio` | Jest / Mocha / Jasmine |
| Python | `Appium-Python-Client` | pytest / unittest |
| Java | `java-client` | JUnit / TestNG |
| Ruby | `appium_lib` | RSpec |
| C# | `Appium.WebDriver` | NUnit / xUnit |

本项目示例使用 **WebdriverIO + Jest** 组合（JavaScript）。

## 九、最佳实践

1. **优先使用 Accessibility ID 定位元素** — 跨平台一致，语义明确，且对 UI 结构变化更稳健
2. **避免过度依赖 XPath** — 性能差，且容易因为 UI 层级变动而失效
3. **使用 Page Object 模式** — 将页面元素和操作封装到独立的类中，提高复用性和可维护性
4. **合理使用等待策略** — 用显式等待（`waitUntil`）代替硬编码的 `sleep`
5. **测试数据隔离** — 每个测试用例应独立，不依赖其他用例的执行结果
6. **并行执行** — 利用 Appium 多会话能力在多台设备上并行测试以缩短总耗时
7. **CI/CD 集成** — 结合 GitHub Actions + Android Emulator 或云测试平台（BrowserStack、Sauce Labs）实现持续测试

## 十、常见问题

### Q: Appium 1.x 和 2.x 有什么区别？

Appium 2.x 是一次重大重构：
- Driver 不再内置，需要单独安装（`appium driver install ...`）
- 支持插件系统（`appium plugin install ...`）
- Capabilities 需要加 `appium:` 前缀（除 W3C 标准字段外）
- 不再自带 `chromedriver`，由 Driver 自行管理

### Q: 真机测试需要什么准备？

- **Android**：开启开发者选项 → USB 调试，通过 `adb devices` 确认设备连接
- **iOS**：需要 Apple 开发者账号，配置签名和 Provisioning Profile

### Q: 和 Playwright 相比如何选择？

| | Appium | Playwright |
|--|--------|-----------|
| 原生 App | ✅ 支持 | ❌ 不支持 |
| 移动端网页 | ✅ 支持 | ✅ 支持（模拟 + Android Chrome） |
| 桌面端浏览器 | ❌ | ✅ 核心能力 |
| 执行速度 | 较慢 | 快 |
| 上手难度 | 中等（环境配置较复杂） | 低 |

**建议**：移动端网页测试优先选 Playwright；涉及原生 App 测试则必须用 Appium。

## 十一、学习资源

- [Appium 官方文档](https://appium.io/docs/en/latest/)
- [Appium GitHub](https://github.com/appium/appium)
- [WebdriverIO Appium 文档](https://webdriver.io/docs/appium)
- [Appium Inspector](https://github.com/appium/appium-inspector)
- [Appium Discuss 论坛](https://discuss.appium.io/)
