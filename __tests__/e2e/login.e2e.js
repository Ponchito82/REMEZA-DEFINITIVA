require("./init");

const { element, by, expect: detoxExpect } = require("detox");

describe("Login", () => {
  it("navega al Dashboard al presionar Sign In", async () => {
    await element(by.id("login-phoneInput")).typeText("5512345678");
    await element(by.id("login-accessCodeInput")).typeText("123456");
    await element(by.id("login-signInButton")).tap();

    await detoxExpect(element(by.id("dashboard-menuButton"))).toBeVisible();
  });

  it("navega al registro desde el link de 'no tengo cuenta'", async () => {
    await element(by.id("login-registerLink")).tap();

    await detoxExpect(element(by.id("register-phoneInput"))).toBeVisible();
  });
});
