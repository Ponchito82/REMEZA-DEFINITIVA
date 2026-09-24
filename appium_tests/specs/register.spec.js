const { clickWithRetry, hideKeyboard, openLogin, scrollToId, selectFromSearchable } = require("../helpers");

const APP_ID = "com.remezaapp";

async function restartAppToRegister() {
  await driver.executeScript("mobile: terminateApp", [{ appId: APP_ID }]);
  await driver.executeScript("mobile: activateApp", [{ appId: APP_ID }]);
  await openLogin();
  await $('android=new UiSelector().resourceId("login-registerLink")').click();
  await $('android=new UiSelector().resourceId("register-phoneInput")').waitForDisplayed({ timeout: 10000 });
}

async function selectDropdownOption(fieldTestId, optionText) {
  const field = await scrollToId(fieldTestId);
  await field.click();
  const option = $(`//*[@text="${optionText}"]`);
  await option.waitForDisplayed({ timeout: 5000 });
  await option.click();
}

async function setValueScrolled(testId, value) {
  const el = await scrollToId(testId);
  await el.setValue(value);
}

async function captureDocument(fieldTestId) {
  await clickWithRetry(fieldTestId);

  const takePhotoOption = $('//*[@text="Take photo"]');
  await takePhotoOption.waitForDisplayed({ timeout: 5000 });
  await takePhotoOption.click();

  const captureButton = $('android=new UiSelector().resourceId("register-cameraCaptureButton")');
  await captureButton.waitForDisplayed({ timeout: 10000 });
  await captureButton.click();

  const usePhotoButton = $('android=new UiSelector().resourceId("register-cameraUsePhotoButton")');
  await usePhotoButton.waitForDisplayed({ timeout: 10000 });
  await usePhotoButton.click();
}

async function fillDocuments() {
  await captureDocument("register-identificationFrontField");
  await captureDocument("register-identificationBackField");
}

async function fillStep1(phone = "5512345678") {
  await $('android=new UiSelector().resourceId("register-phoneInput")').setValue(phone);
  await $('android=new UiSelector().resourceId("register-nextButton")').click();
  await $('android=new UiSelector().resourceId("register-otpInput-0")').waitForDisplayed({ timeout: 10000 });
}

async function fillStep2(code = "123456") {
  const digits = String(code).split("");
  for (let i = 0; i < 6; i++) {
    await $(`android=new UiSelector().resourceId("register-otpInput-${i}")`).setValue(digits[i]);
  }
  await hideKeyboard();
  await clickWithRetry("register-verifyCodeButton");
  await $('android=new UiSelector().resourceId("register-accessCodeInput")').waitForDisplayed({ timeout: 10000 });
}

async function fillStep3(code = "573920") {
  await $('android=new UiSelector().resourceId("register-accessCodeInput")').setValue(code);
  await $('android=new UiSelector().resourceId("register-confirmAccessCodeInput")').setValue(code);
  await $('android=new UiSelector().resourceId("register-setAccessCodeButton")').click();
  await scrollToId("register-firstNameInput");
}

async function fillStep4ExceptDocuments() {
  await selectDropdownOption("register-dobDayInput", "01");
  await selectDropdownOption("register-dobMonthInput", "January");
  await selectDropdownOption("register-dobYearInput", String(new Date().getFullYear() - 16));

  await selectDropdownOption("register-nationalityInput", "Mexico");
  await selectDropdownOption("register-foreignIdTypeInput", "Passport");
  await setValueScrolled("register-foreignIdInput", "G1234567");
  await selectDropdownOption("register-genderInput", "Male");

  await setValueScrolled("register-emailInput", "adrian.morfin@example.com");

  await setValueScrolled("register-firstNameInput", "Adrian");
  await hideKeyboard();
  await setValueScrolled("register-paternalLastNameInput", "Morfin");
  await hideKeyboard();

  await setValueScrolled("register-zipCodeInput", "90001");
  await hideKeyboard();

  // El ZIP consulta la API de codigos postales de EE. UU. y autocompleta
  // estado y ciudad; el pais va fijo en Estados Unidos.
  await browser.pause(2000);
  await expect(await scrollToId("register-stateSelect")).toHaveText("California");
  await expect(await scrollToId("register-citySelect")).toHaveText("Los Angeles");

  await setValueScrolled("register-streetInput", "Main St");
  await hideKeyboard();
  await setValueScrolled("register-exteriorNumberInput", "123");
  await hideKeyboard();
}

describe("Registro paso 1 — teléfono", () => {
  beforeEach(async () => {
    await restartAppToRegister();
  });

  it("'Next' deshabilitado con el teléfono vacío", async () => {
    await expect($('android=new UiSelector().resourceId("register-nextButton")')).not.toBeEnabled();
  });

  it("'Next' deshabilitado con menos de 10 dígitos", async () => {
    await $('android=new UiSelector().resourceId("register-phoneInput")').setValue("55123");

    await expect($('android=new UiSelector().resourceId("register-nextButton")')).not.toBeEnabled();
  });

  it("'Next' se habilita con 10 dígitos y avanza al paso 2", async () => {
    await $('android=new UiSelector().resourceId("register-phoneInput")').setValue("5512345678");

    await expect($('android=new UiSelector().resourceId("register-nextButton")')).toBeEnabled();

    await $('android=new UiSelector().resourceId("register-nextButton")').click();
    await $('android=new UiSelector().resourceId("register-otpInput-0")').waitForDisplayed({ timeout: 10000 });
  });

  it("el botón de regresar en el paso 1 vuelve al Login", async () => {
    await $('android=new UiSelector().resourceId("register-backButton")').click();

    await $('android=new UiSelector().resourceId("login-phoneInput")').waitForDisplayed({ timeout: 10000 });
  });
});

describe("Registro paso 2 — código SMS", () => {
  beforeEach(async () => {
    await restartAppToRegister();
    await fillStep1();
  });

  it("'Verify Code' deshabilitado si faltan casillas del OTP", async () => {
    await $('android=new UiSelector().resourceId("register-otpInput-0")').setValue("1");
    await $('android=new UiSelector().resourceId("register-otpInput-1")').setValue("2");
    await $('android=new UiSelector().resourceId("register-otpInput-2")').setValue("3");

    await expect($('android=new UiSelector().resourceId("register-verifyCodeButton")')).not.toBeEnabled();
  });

  it("'Verify Code' se habilita con las 6 casillas llenas y avanza al paso 3", async () => {
    for (let i = 0; i < 6; i++) {
      await $(`android=new UiSelector().resourceId("register-otpInput-${i}")`).setValue(String(i + 1));
    }

    await expect($('android=new UiSelector().resourceId("register-verifyCodeButton")')).toBeEnabled();

    await hideKeyboard();
    await clickWithRetry("register-verifyCodeButton");
    await $('android=new UiSelector().resourceId("register-accessCodeInput")').waitForDisplayed({ timeout: 10000 });
  });
});

describe("Registro paso 3 — código de acceso", () => {
  beforeEach(async () => {
    await restartAppToRegister();
    await fillStep1();
    await fillStep2();
  });

  it("'Set Access Code' deshabilitado si algún campo no tiene 6 dígitos", async () => {
    await $('android=new UiSelector().resourceId("register-accessCodeInput")').setValue("573920");
    await $('android=new UiSelector().resourceId("register-confirmAccessCodeInput")').setValue("573");

    await expect($('android=new UiSelector().resourceId("register-setAccessCodeButton")')).not.toBeEnabled();
  });

  it("rechaza un código débil (secuencia 123456) y no avanza", async () => {
    await $('android=new UiSelector().resourceId("register-accessCodeInput")').setValue("123456");
    await $('android=new UiSelector().resourceId("register-confirmAccessCodeInput")').setValue("123456");
    await $('android=new UiSelector().resourceId("register-setAccessCodeButton")').click();

    await expect(
      $('//*[@text="Choose a less predictable code (avoid repeated or sequential digits)."]')
    ).toBeDisplayed();
    await expect($('android=new UiSelector().resourceId("register-accessCodeInput")')).toBeDisplayed();
  });

  it("rechaza códigos que no coinciden y no avanza", async () => {
    await $('android=new UiSelector().resourceId("register-accessCodeInput")').setValue("573920");
    await $('android=new UiSelector().resourceId("register-confirmAccessCodeInput")').setValue("573921");
    await $('android=new UiSelector().resourceId("register-setAccessCodeButton")').click();

    await expect($('//*[@text="Codes don\'t match."]')).toBeDisplayed();
    await expect($('android=new UiSelector().resourceId("register-accessCodeInput")')).toBeDisplayed();
  });

  it("acepta un código fuerte con confirmación correcta y avanza al paso 4", async () => {
    await $('android=new UiSelector().resourceId("register-accessCodeInput")').setValue("573920");
    await $('android=new UiSelector().resourceId("register-confirmAccessCodeInput")').setValue("573920");
    await $('android=new UiSelector().resourceId("register-setAccessCodeButton")').click();

    await scrollToId("register-firstNameInput");
  });
});

describe("Registro paso 4 — datos personales", () => {
  beforeEach(async () => {
    await restartAppToRegister();
    await fillStep1();
    await fillStep2();
    await fillStep3();
  });

  it("con todo vacío, 'Complete Registration' no avanza y muestra el primer pendiente", async () => {
    await clickWithRetry("register-completeRegistrationButton");

    await scrollToId("register-validationBanner");
    await expect($('android=new UiSelector().resourceId("register-successScreen")')).not.toBeDisplayed();
  });

  it("sin código postal, el mensaje pedido es el del código postal", async () => {
    await selectDropdownOption("register-nationalityInput", "Mexico");
    await selectDropdownOption("register-foreignIdTypeInput", "Passport");
    await setValueScrolled("register-foreignIdInput", "G1234567");
    await setValueScrolled("register-emailInput", "adrian.morfin@example.com");
    await setValueScrolled("register-firstNameInput", "Adrian");
    await hideKeyboard();
    await setValueScrolled("register-paternalLastNameInput", "Morfin");
    await hideKeyboard();

    await clickWithRetry("register-completeRegistrationButton");

    await scrollToId("register-validationBanner");
    await expect($('//*[@text="Enter your postal code to continue."]')).toBeDisplayed();
  });

  it("con todo lleno EXCEPTO los documentos, no avanza a KYC", async () => {
    await fillStep4ExceptDocuments();

    await clickWithRetry("register-completeRegistrationButton");

    await expect(
      $('//*[@text="Complete all required fields to continue."]')
    ).toBeDisplayed();
    await expect($('android=new UiSelector().resourceId("register-successScreen")')).not.toBeDisplayed();
  });

  it("Estado bloqueado sin código postal válido y habilitado al capturarlo", async () => {
    await expect(await scrollToId("register-stateSelect")).toBeDisabled();

    await setValueScrolled("register-zipCodeInput", "10001");
    await hideKeyboard();

    await expect(await scrollToId("register-stateSelect")).toBeEnabled();
  });

  it("happy path completo del paso 4 (con documentos) llega a la pantalla de éxito, no a KYC", async () => {
    await fillStep4ExceptDocuments();
    await fillDocuments();

    await clickWithRetry("register-completeRegistrationButton");

    await $('android=new UiSelector().resourceId("register-verifyingScreen")').waitForDisplayed({
      timeout: 10000,
    });

    await $('android=new UiSelector().resourceId("register-successScreen")').waitForDisplayed({
      timeout: 20000,
    });
  });
});

describe("Registro paso 4 — verificación de correo (simulada)", () => {
  beforeEach(async () => {
    await restartAppToRegister();
    await fillStep1();
    await fillStep2();
    await fillStep3();
  });

  it("'Send code to my email' deshabilitado sin un correo válido", async () => {
    await expect(await scrollToId("register-sendEmailCodeButton")).toBeDisabled();
  });

  it("envía y verifica el código de correo (simulado) y muestra 'Email verified.'", async () => {
    await setValueScrolled("register-emailInput", "adrian.morfin@example.com");
    await hideKeyboard();

    await clickWithRetry("register-sendEmailCodeButton");
    await $('android=new UiSelector().resourceId("register-emailCodeInput")').waitForDisplayed({
      timeout: 10000,
    });

    await setValueScrolled("register-emailCodeInput", "111111");
    await hideKeyboard();
    await clickWithRetry("register-verifyEmailCodeButton");

    await $('android=new UiSelector().resourceId("register-emailVerifiedNotice")').waitForDisplayed({
      timeout: 10000,
    });
  });
});

describe("Registro pasos 5 y 6 — verificación y pantalla de éxito", () => {
  beforeEach(async () => {
    await restartAppToRegister();
    await fillStep1();
    await fillStep2();
    await fillStep3();
    await fillStep4ExceptDocuments();
    await fillDocuments();
    await clickWithRetry("register-completeRegistrationButton");
    await $('android=new UiSelector().resourceId("register-successScreen")').waitForDisplayed({
      timeout: 20000,
    });
  });

  it("la pantalla de éxito muestra el teléfono registrado", async () => {
    await expect($('android=new UiSelector().resourceId("register-successPhone")')).toHaveText(
      expect.stringContaining("5512345678".slice(0, 3)),
    );
  });

  it("el código de acceso aparece oculto por defecto y se revela con el toggle", async () => {
    const accessCodeText = $('android=new UiSelector().resourceId("register-successAccessCode")');
    await expect(accessCodeText).toHaveText("••••••");

    await $('android=new UiSelector().resourceId("register-toggleAccessCodeButton")').click();
    await expect(accessCodeText).toHaveText("573920");

    await $('android=new UiSelector().resourceId("register-toggleAccessCodeButton")').click();
    await expect(accessCodeText).toHaveText("••••••");
  });

  it("'Sign In' regresa a Login con el teléfono prellenado (la clave no se prellena nunca)", async () => {
    await $('android=new UiSelector().resourceId("register-goToLoginButton")').click();

    const phoneInput = await $('android=new UiSelector().resourceId("login-phoneInput")');
    await phoneInput.waitForDisplayed({ timeout: 10000 });
    await expect(phoneInput).toHaveText("+15512345678");

    await expect($('android=new UiSelector().resourceId("login-accessCodeInput")')).toHaveText(
      "6-digit access code",
    );
  });
});
