/**
 * Appium Android 入门示例
 *
 * 前置条件：
 *   1. 已启动 Appium Server（appium）
 *   2. 已启动 Android Emulator 或连接真机（adb devices 可见）
 *   3. 修改 helpers.js 中的 ANDROID_CAPS 或设置 ANDROID_APP_PATH 环境变量
 *
 * 运行方式：
 *   npx jest tests/android-basic.test.js
 */

const { ANDROID_CAPS, createDriver } = require('./helpers');

describe('Android 基础操作示例', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver(ANDROID_CAPS);
  }, 60_000);

  afterAll(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('应用应成功启动', async () => {
    // 获取当前 Activity，验证应用已启动
    const activity = await driver.getCurrentActivity();
    console.log('当前 Activity:', activity);
    expect(activity).toBeTruthy();
  });

  test('通过 Accessibility ID 查找元素并点击', async () => {
    // Accessibility ID 是跨平台推荐的定位方式
    // 请将 'login_button' 替换为你的应用中的真实 Accessibility ID
    const button = await driver.$('~login_button');
    await button.waitForDisplayed({ timeout: 5000 });
    await button.click();
  });

  test('通过 Resource ID 查找元素并输入文本', async () => {
    // Android Resource ID 定位（最常用的 Android 定位方式）
    // 请将 ID 替换为实际值
    const usernameInput = await driver.$('android=new UiSelector().resourceId("com.example:id/username")');
    await usernameInput.waitForDisplayed({ timeout: 5000 });
    await usernameInput.clearValue();
    await usernameInput.setValue('testuser');

    const value = await usernameInput.getText();
    expect(value).toBe('testuser');
  });

  test('通过 XPath 查找元素', async () => {
    // XPath 功能强大但性能较差，尽量用其他方式替代
    const element = await driver.$('//android.widget.TextView[@text="Welcome"]');
    await element.waitForDisplayed({ timeout: 5000 });

    const text = await element.getText();
    expect(text).toBe('Welcome');
  });

  test('滑动屏幕', async () => {
    // W3C Actions API 实现滑动
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 200, y: 800 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: 200, y: 200 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions();
  });

  test('截图', async () => {
    const screenshot = await driver.takeScreenshot();
    expect(screenshot).toBeTruthy();
    // screenshot 是 Base64 编码的 PNG 图片
    // 可以写入文件：fs.writeFileSync('screenshot.png', screenshot, 'base64');
    console.log('截图长度:', screenshot.length, 'bytes (base64)');
  });
});
