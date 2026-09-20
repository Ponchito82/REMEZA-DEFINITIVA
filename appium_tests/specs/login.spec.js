const { hideKeyboard, openLogin } = require("../helpers");

const APP_ID = "com.remezaapp";

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

async function restartApp() {
  await driver.executeScript("mobile: terminateApp", [{ appId: APP_ID }]);
  await driver.executeScript("mobile: activateApp", [{ appId: APP_ID }]);
  await openLogin();
}

describe("Login — validación de campos", () => {
  beforeEach(async () => {
    await restartApp();
  });

  it("deja 'Sign In' deshabilitado con ambos campos vacíos", async () => {
    await expect($('android=new UiSelector().resourceId("login-signInButton")')).not.toBeEnabled();
  });

  it("deja 'Sign In' deshabilitado si el teléfono no trae prefijo '+' (no es E.164)", async () => {
    await $('android=new UiSelector().resourceId("login-phoneInput")').setValue("525538068807");
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').setValue(TEST_CODE);

    await expect($('android=new UiSelector().resourceId("login-signInButton")')).not.toBeEnabled();
  });

  it("deja 'Sign In' deshabilitado si el código tiene menos de 6 dígitos", async () => {
    await $('android=new UiSelector().resourceId("login-phoneInput")').setValue(TEST_PHONE);
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').setValue("1234");

    await expect($('android=new UiSelector().resourceId("login-signInButton")')).not.toBeEnabled();
  });

  it("muestra el error de formato al salir del campo de teléfono inválido", async () => {
    const phoneInput = $('android=new UiSelector().resourceId("login-phoneInput")');

    await phoneInput.click();
    await phoneInput.setValue("12345");

    await hideKeyboard();
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').click();

    await expect($('//*[@text="Enter a valid 10-digit phone number."]')).toBeDisplayed();
  });

  it("habilita 'Sign In' cuando el teléfono es E.164 y el código tiene 6 dígitos", async () => {
    await $('android=new UiSelector().resourceId("login-phoneInput")').setValue(TEST_PHONE);
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').setValue(TEST_CODE);

    await expect($('android=new UiSelector().resourceId("login-signInButton")')).toBeEnabled();
  });
});

describe("Login — navegación", () => {
  beforeEach(async () => {
    await restartApp();
  });

  it("el link 'Sign up' navega al paso 1 del registro", async () => {
    await $('android=new UiSelector().resourceId("login-registerLink")').click();

    await $('android=new UiSelector().resourceId("register-phoneInput")').waitForDisplayed({ timeout: 10000 });
  });

  it("el link '¿Olvidaste tu código?' abre la pantalla de recuperación", async () => {
    await $('android=new UiSelector().resourceId("login-forgotAccessCodeLink")').click();

    await $('//*[@text="Recover access code"]').waitForDisplayed({ timeout: 10000 });
  });
});

describe("Login — backend real [backend]", () => {
  beforeEach(async () => {
    await restartApp();
  });

  it("credenciales válidas navegan al Dashboard", async () => {
    await $('android=new UiSelector().resourceId("login-phoneInput")').setValue(TEST_PHONE);
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').setValue(TEST_CODE);
    await $('android=new UiSelector().resourceId("login-signInButton")').click();

    await $('android=new UiSelector().resourceId("dashboard-menuButton")').waitForDisplayed({ timeout: 20000 });
  });

  it("código incorrecto muestra error y NO navega", async () => {
    await $('android=new UiSelector().resourceId("login-phoneInput")').setValue(TEST_PHONE);
    await $('android=new UiSelector().resourceId("login-accessCodeInput")').setValue("999999");
    await $('android=new UiSelector().resourceId("login-signInButton")').click();

    await expect(
      $('//*[@text="Invalid phone number or access code."]')
    ).toBeDisplayed();
    await expect($('android=new UiSelector().resourceId("login-phoneInput")')).toBeDisplayed();
  });
});
