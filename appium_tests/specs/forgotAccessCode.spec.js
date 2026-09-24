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

  // "Recupera tu acceso" (21): se elige la via por telefono y se continua.
  await $('android=new UiSelector().resourceId("recoverAccess.option.phone")').waitForDisplayed({ timeout: 10000 });
  await $('android=new UiSelector().resourceId("recoverAccess.option.phone")').click();
  await $('android=new UiSelector().resourceId("recoverAccess.continueButton")').click();

  await $('android=new UiSelector().resourceId("forgot-phoneInput")').waitForDisplayed({ timeout: 10000 });
};

const sendRecoveryCode = async (phone = "5512345678") => {
  await editTextAt(0).setValue(phone);
  await clickTextWithRetry("Send code");
  await $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]').waitForDisplayed({
    timeout: 5000,
  });
};

describe("Recuperar código de acceso — teléfono", () => {
  beforeEach(async () => {
    await goToForgotAccessCode();
  });

  it("con menos de 7 dígitos no envía el código (no aparecen los campos de recuperación)", async () => {
    await editTextAt(0).setValue("123456");
    await clickTextWithRetry("Send code");

    await expect(
      $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]')
    ).not.toBeDisplayed();
  });

  it("con teléfono válido, envía el código y muestra los campos de recuperación", async () => {
    await sendRecoveryCode();

    await expect(
      $('//*[@text="If this number has an account, a recovery code has been sent via SMS."]')
    ).toBeDisplayed();
  });
});

describe("Recuperar código de acceso — reseteo", () => {
  beforeEach(async () => {
    await goToForgotAccessCode();
    await sendRecoveryCode();
  });

  it("un código nuevo débil (secuencial) muestra el error y no confirma el reseteo", async () => {
    await editTextAt(1).setValue("123456");
    await editTextAt(2).setValue("123456");
    await editTextAt(3).setValue("123456");
    await clickTextWithRetry("Reset access code");

    await expect(
      $('//*[@text="Choose a less predictable code (avoid repeated or sequential digits)."]')
    ).toBeDisplayed();
  });

  it("códigos que no coinciden muestran el error de mismatch", async () => {
    await editTextAt(1).setValue("123456");
    await editTextAt(2).setValue("573920");
    await editTextAt(3).setValue("573921");
    await clickTextWithRetry("Reset access code");

    await expect($('//*[@text="Codes don\'t match."]')).toBeDisplayed();
  });

  it("código de recuperación + código fuerte confirmado resetea y permite volver a Sign In", async () => {
    await editTextAt(1).setValue("123456");
    await editTextAt(2).setValue("573920");
    await editTextAt(3).setValue("573920");
    await clickTextWithRetry("Reset access code");

    await expect(
      $('//*[@text="Your access code was updated. Sign in with your new code."]')
    ).toBeDisplayed();

    await clickTextWithRetry("Back to sign in");

    await $('android=new UiSelector().resourceId("login-phoneInput")').waitForDisplayed({ timeout: 10000 });
  });
});
