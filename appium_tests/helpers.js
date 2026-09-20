const APP_ID = "com.remezaapp";

const byId = (id) => $(`android=new UiSelector().resourceId("${id}")`);

const MAX_SCROLL_SWIPES = 12;

const hideKeyboard = async () => {
  try {
    await driver.hideKeyboard();
  } catch {
  }
  await browser.pause(400);
};

const isReachable = async (id) => {
  const el = await byId(id);
  if (!(await el.isExisting())) return false;
  return el.isDisplayed();
};

const swipe = async (direction) => {
  const { width, height } = await driver.getWindowSize();

  return driver.execute("mobile: scrollGesture", {
    left: Math.round(width * 0.1),
    top: Math.round(height * 0.15),
    width: Math.round(width * 0.8),
    height: Math.round(height * 0.6),
    direction,
    percent: 0.75,
  });
};

const scrollToId = async (id) => {
  if (await isReachable(id)) return byId(id);

  await hideKeyboard();
  if (await isReachable(id)) return byId(id);

  for (const direction of ["down", "up"]) {
    for (let i = 0; i < MAX_SCROLL_SWIPES; i++) {
      const canScrollMore = await swipe(direction);
      await browser.pause(250);

      if (await isReachable(id)) return byId(id);
      if (!canScrollMore) break;
    }
  }

  throw new Error(
    `scrollToId: "${id}" no quedó visible tras recorrer el contenedor en ambos sentidos. ` +
      `Si el testID es correcto, revisa que el elemento se renderice en este paso del flujo.`
  );
};

const clickWithRetry = async (id) => {
  const el = await scrollToId(id);

  const { x, y } = await el.getLocation();
  const { width, height } = await el.getSize();

  await driver.execute("mobile: clickGesture", {
    x: Math.round(x + width / 2),
    y: Math.round(y + height * 0.3),
  });
};

const WELCOME_CTA = "welcome-getStartedButton";

/**
 * La app arranca en WelcomeView; este helper cruza esa pantalla y deja
 * el Login visible. Es idempotente: si ya estamos en Login no hace nada.
 */
const openLogin = async (timeout = 30000) => {
  const cta = byId(WELCOME_CTA);

  if (await cta.isExisting()) {
    await cta.waitForDisplayed({ timeout: 15000 });
    await cta.click();
  }

  await byId("login-phoneInput").waitForDisplayed({ timeout });
};

const restartApp = async () => {
  await driver.execute("mobile: terminateApp", { appId: APP_ID });
  await driver.execute("mobile: activateApp", { appId: APP_ID });
  await openLogin();
};

const selectFromSearchable = async (selectId, optionValue, searchText) => {
  await clickWithRetry(selectId);

  const search = byId(`${selectId}-search`);
  await search.waitForDisplayed({ timeout: 5000 });

  if (searchText) {
    await search.setValue(searchText);
    await browser.pause(300);
  }

  const option = byId(`${selectId}-option-${optionValue}`);
  await option.waitForDisplayed({ timeout: 5000 });
  await option.click();
  await browser.pause(300);
};

module.exports = {
  byId,
  openLogin,
  scrollToId,
  clickWithRetry,
  restartApp,
  hideKeyboard,
  selectFromSearchable,
};
