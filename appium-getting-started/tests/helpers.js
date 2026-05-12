const { remote } = require('webdriverio');

const APPIUM_HOST = process.env.APPIUM_HOST || 'localhost';
const APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723', 10);

/**
 * Android 默认 capabilities，可通过展开覆盖。
 * appPackage / appActivity / app 字段请根据实际被测应用修改。
 */
const ANDROID_CAPS = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:app': process.env.ANDROID_APP_PATH || '/path/to/your/app.apk',
  'appium:noReset': true,
  'appium:newCommandTimeout': 240,
};

/**
 * iOS 默认 capabilities。
 * bundleId / app 字段请根据实际被测应用修改。
 */
const IOS_CAPS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 15',
  'appium:platformVersion': '17.4',
  'appium:app': process.env.IOS_APP_PATH || '/path/to/your/app.app',
  'appium:noReset': true,
  'appium:newCommandTimeout': 240,
};

async function createDriver(capabilities) {
  const driver = await remote({
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    path: '/',
    capabilities,
    logLevel: 'warn',
  });
  return driver;
}

module.exports = { ANDROID_CAPS, IOS_CAPS, createDriver };
