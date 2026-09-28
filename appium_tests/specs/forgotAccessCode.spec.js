const { restartApp } = require("../helpers");


const editTextAt = (index) =>
  $(`android=new UiSelector().className("android.widget.EditText").instance(${index})`);

const clickTextWithRetry = async (text) => {
  const el = $(`//*[@text="${text}"]`);
  await el.waitForExist({ timeout: 10000 });
  const { x, y } = await el.getLocation();
  const { width, height } = await el.getSize();
  await driver.execute("mobile: clickGesture", {
    x: Math.round(x + width / 2),
    y: Math.round(y + height * 0.3),
  });
};

const goToForgotAccessCode = async () => {
  await restartApp();
  await $('android=new UiSelector().resourceId("login-phoneInput")').waitForDisplayed({ timeout: 15000 });
  await $('android=new UiSelector().resourceId("login-forgotAccessCodeLink")').click();

  // "Restablece tu acceso" (21): se elige la via por telefono y se continua.
  await $('android=new UiSelector().resourceId("recoverAccess.option.phone")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().resourceId("recoverAccess.option.phone")').click();
  await $('android=new UiSelector().resourceId("recoverAccess.continueButton")').click();

  await $('android=new UiSelector().resourceId("forgot-phoneInput")').waitForDisplayed({ timeout: 10000 });
};

// Paso 1 -> 2: telefono, envia el codigo. Deja el campo de codigo de recuperacion listo.
const sendRecoveryCode = async (phone = "5512345678") => {
  await editTextAt(0).setValue(phone);
  await clickTextWithRetry("Send code");
  await $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]').waitForDisplayed({
    timeout: 5000,
  });
};

// Paso 2 -> 3: codigo de recuperacion. Abre la pantalla dedicada al nuevo codigo.
const continueToNewCode = async (code = "123456") => {
  await editTextAt(0).setValue(code);
  await clickTextWithRetry("Continue");
  await $('android=new UiSelector().resourceId("forgot-newAccessCodeInput")').waitForDisplayed({
    timeout: 5000,
  });
};

describe("Restablecer código de acceso — teléfono", () => {
  beforeEach(async () => {
    await goToForgotAccessCode();
  });

  it("con menos de 7 dígitos no envía el código (no llega a la pantalla del código)", async () => {
    await editTextAt(0).setValue("123456");
    await clickTextWithRetry("Send code");

    await expect(
      $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]')
    ).not.toBeDisplayed();
  });

  it("con teléfono válido, envía el código y muestra el campo de recuperación", async () => {
    await sendRecoveryCode();

    await expect(
      $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]')
    ).toBeDisplayed();
  });
});

describe("Restablecer código de acceso — nuevo código dedicado", () => {
  beforeEach(async () => {
    await goToForgotAccessCode();
    await sendRecoveryCode();
  });

  it("el código de recuperación abre una pantalla propia para el nuevo código", async () => {
    await continueToNewCode();

    await expect(
      $('android=new UiSelector().resourceId("forgot-newAccessCodeInput")')
    ).toBeDisplayed();
    await expect(
      $('android=new UiSelector().resourceId("forgot-confirmAccessCodeInput")')
    ).toBeDisplayed();
  });

  it("un código nuevo débil (secuencial) muestra el error y no confirma el reseteo", async () => {
    await continueToNewCode();

    await editTextAt(0).setValue("123456");
    await editTextAt(1).setValue("123456");
    await clickTextWithRetry("Reset access code");

    await expect(
      $('//*[@text="Choose a less predictable code (avoid repeated or sequential digits)."]')
    ).toBeDisplayed();
  });

  it("códigos que no coinciden muestran el error de mismatch", async () => {
    await continueToNewCode();

    await editTextAt(0).setValue("573920");
    await editTextAt(1).setValue("573921");
    await clickTextWithRetry("Reset access code");

    await expect($('//*[@text="Codes don\'t match."]')).toBeDisplayed();
  });

  it("código fuerte confirmado resetea, muestra el mensaje de éxito y vuelve a Sign In", async () => {
    await continueToNewCode();

    await editTextAt(0).setValue("573920");
    await editTextAt(1).setValue("573920");
    await clickTextWithRetry("Reset access code");

    await expect($('//*[@text="Your access code has been reset."]')).toBeDisplayed();

    await clickTextWithRetry("Continue");

    await $('android=new UiSelector().resourceId("login-phoneInput")').waitForDisplayed({ timeout: 10000 });
  });
});
