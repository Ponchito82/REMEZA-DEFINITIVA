exports.config = {
  runner: "local",
  path: "/",
  hostname: "127.0.0.1",
  port: 4723,

  specs: ["./specs/**/*.spec.js"],

  maxInstances: 1,

  capabilities: [
    {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:deviceName": "Android Emulator",
      "appium:app": "android/app/build/outputs/apk/debug/app-debug.apk",
      "appium:appPackage": "com.remezaapp",
      "appium:appActivity": ".MainActivity",
      "appium:autoGrantPermissions": true,
      "appium:newCommandTimeout": 240,
    },
  ],

  logLevel: "info",
  bail: 0,
  waitforTimeout: 60000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 240000,
  },

  reporters: ["spec"],
};
