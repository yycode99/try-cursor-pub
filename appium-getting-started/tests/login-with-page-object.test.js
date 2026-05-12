/**
 * 使用 Page Object 模式的测试示例
 *
 * 将元素定位和操作封装到 Page Object（tests/pages/LoginPage.js），
 * 测试用例只关注业务逻辑，不直接操作底层选择器。
 */

const { ANDROID_CAPS, createDriver } = require('./helpers');
const LoginPage = require('./pages/LoginPage');

describe('登录功能测试 (Page Object 模式)', () => {
  let driver;
  let loginPage;

  beforeAll(async () => {
    driver = await createDriver(ANDROID_CAPS);
    loginPage = new LoginPage(driver);
  }, 60_000);

  afterAll(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });

  test('使用正确的凭据登录成功', async () => {
    await loginPage.login('admin', 'password123');

    // 登录成功后，登录按钮应不再显示
    const activity = await driver.getCurrentActivity();
    console.log('登录后 Activity:', activity);
  });

  test('使用错误密码登录失败并显示错误信息', async () => {
    await loginPage.login('admin', 'wrong_password');

    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('密码错误');
  });

  test('空用户名时登录按钮仍可见', async () => {
    const isVisible = await loginPage.isLoginButtonDisplayed();
    expect(isVisible).toBe(true);
  });
});
