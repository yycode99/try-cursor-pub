/**
 * Appium iOS 入门示例
 *
 * 前置条件：
 *   1. macOS + Xcode 已安装
 *   2. 已启动 Appium Server（appium）
 *   3. 已启动 iOS Simulator 或配置好真机签名
 *   4. 修改 helpers.js 中的 IOS_CAPS 或设置 IOS_APP_PATH 环境变量
 *
 * 运行方式：
 *   npx jest tests/ios-basic.test.js
 */

const { IOS_CAPS, createDriver } = require('./helpers');

describe('iOS 基础操作示例', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver(IOS_CAPS);
  }, 90_000);

  afterAll(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('应用应成功启动', async () => {
    // 检查当前 Bundle ID
    const bundleId = await driver.execute('mobile: activeAppInfo', {});
    console.log('当前应用信息:', JSON.stringify(bundleId));
    expect(bundleId).toBeTruthy();
  });

  test('通过 Accessibility ID 查找元素并点击', async () => {
    // Accessibility ID 对应 iOS 中的 accessibilityIdentifier
    const button = await driver.$('~login_button');
    await button.waitForDisplayed({ timeout: 5000 });
    await button.click();
  });

  test('通过 iOS Predicate String 查找元素', async () => {
    // iOS Predicate 比 XPath 性能更好
    const element = await driver.$('-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "Welcome"');
    await element.waitForDisplayed({ timeout: 5000 });

    const text = await element.getText();
    expect(text).toBe('Welcome');
  });

  test('通过 iOS Class Chain 查找元素', async () => {
    // Class Chain 类似 XPath 但专为 iOS 优化
    const element = await driver.$('-ios class chain:**/XCUIElementTypeCell[`name == "item_1"`]');
    await element.waitForDisplayed({ timeout: 5000 });
    expect(await element.isDisplayed()).toBe(true);
  });

  test('输入文本', async () => {
    const input = await driver.$('~username_field');
    await input.waitForDisplayed({ timeout: 5000 });
    await input.clearValue();
    await input.setValue('testuser');

    const value = await input.getText();
    expect(value).toBe('testuser');
  });

  test('滑动屏幕', async () => {
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 200, y: 600 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: 200, y: 100 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  });

  test('处理系统弹窗（权限请求）', async () => {
    // iOS 系统弹窗（如"允许通知"）需要通过 alert API 处理
    try {
      const alertText = await driver.getAlertText();
      console.log('系统弹窗内容:', alertText);
      await driver.acceptAlert(); // 点击"允许"
    } catch {
      console.log('没有检测到系统弹窗');
    }
  });
});
