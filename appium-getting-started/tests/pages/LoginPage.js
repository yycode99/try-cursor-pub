/**
 * Page Object 示例 — 登录页面
 *
 * Page Object 模式将页面元素的定位和操作封装到独立的类中，
 * 使测试用例更加简洁，维护成本更低。
 */

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  get usernameInput() {
    return this.driver.$('~username_field');
  }

  get passwordInput() {
    return this.driver.$('~password_field');
  }

  get loginButton() {
    return this.driver.$('~login_button');
  }

  get errorMessage() {
    return this.driver.$('~error_message');
  }

  async login(username, password) {
    const usernameEl = await this.usernameInput;
    await usernameEl.waitForDisplayed({ timeout: 5000 });
    await usernameEl.clearValue();
    await usernameEl.setValue(username);

    const passwordEl = await this.passwordInput;
    await passwordEl.clearValue();
    await passwordEl.setValue(password);

    const loginBtn = await this.loginButton;
    await loginBtn.click();
  }

  async getErrorText() {
    const errorEl = await this.errorMessage;
    await errorEl.waitForDisplayed({ timeout: 5000 });
    return errorEl.getText();
  }

  async isLoginButtonDisplayed() {
    const loginBtn = await this.loginButton;
    return loginBtn.isDisplayed();
  }
}

module.exports = LoginPage;
