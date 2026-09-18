require("./init");

const { element, by, expect: detoxExpect } = require("detox");

describe("Registro (RegisterSteps, 4 pasos)", () => {
  beforeEach(async () => {
    await element(by.id("login-registerLink")).tap();
  });

  it("avanza los 4 pasos hasta KYC sin validación de campos", async () => {
    await element(by.id("register-phoneInput")).typeText("5512345678");
    await element(by.id("register-nextButton")).tap();

    await element(by.id("register-otpInput-0")).typeText("1");
    await element(by.id("register-otpInput-1")).typeText("2");
    await element(by.id("register-otpInput-2")).typeText("3");
    await element(by.id("register-otpInput-3")).typeText("4");
    await element(by.id("register-verifyCodeButton")).tap();

    await element(by.id("register-accessCodeInput")).typeText("123456");
    await element(by.id("register-setAccessCodeButton")).tap();

    await element(by.id("register-completeRegistrationButton")).tap();

    await detoxExpect(
      element(by.id("kyc-enterDashboardButton"))
    ).toBeVisible();
  });

  it("el botón de regresar en el paso 1 vuelve al Login", async () => {
    await element(by.id("register-backButton")).tap();

    await detoxExpect(element(by.id("login-phoneInput"))).toBeVisible();
  });
});
