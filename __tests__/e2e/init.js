const { device, element, by } = require("detox");

/**
 * La app arranca en WelcomeView; este helper cruza esa pantalla para dejar
 * el Login visible. Si ya estamos en Login simplemente no hace nada.
 */
const openLogin = async () => {
  try {
    await element(by.id("welcome-getStartedButton")).tap();
  } catch (error) {
    // La pantalla de bienvenida no está presente: ya estamos en Login.
  }
};

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
  await openLogin();
});

module.exports = { openLogin };
