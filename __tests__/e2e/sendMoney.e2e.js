require("./init");

const { element, by, expect: detoxExpect } = require("detox");


const goToSendMoney = async () => {
  await element(by.id("login-phoneInput")).typeText("5512345678");
  await element(by.id("login-accessCodeInput")).typeText("123456");
  await element(by.id("login-signInButton")).tap();

  await element(by.id("dashboard-menuButton")).tap();
  await element(by.id("drawer-sendMoneyItem")).tap();
};

describe("Enviar dinero (SendMoneyView)", () => {
  beforeEach(async () => {
    await goToSendMoney();
  });

  it("camino feliz: beneficiario + monto válido navega a confirmación", async () => {
    await element(by.id("sendMoney-beneficiaryCard-1")).tap();
    await element(by.id("sendMoney-amountInput")).typeText("100");
    await element(by.id("sendMoney-sendButton")).tap();

    await detoxExpect(
      element(by.id("sendMoneyConfirmation-confirmButton"))
    ).toBeVisible();
  });

  it("fondos insuficientes: monto mayor al saldo muestra mensaje de error", async () => {
    await element(by.id("sendMoney-beneficiaryCard-1")).tap();
    await element(by.id("sendMoney-amountInput")).typeText("999999");
    await element(by.id("sendMoney-sendButton")).tap();

    await detoxExpect(element(by.id("sendMoney-errorMessage"))).toBeVisible();
  });

  it("sin beneficiario seleccionado: no navega y permanece en la pantalla", async () => {
    await element(by.id("sendMoney-amountInput")).typeText("100");
    await element(by.id("sendMoney-sendButton")).tap();

    await detoxExpect(element(by.id("sendMoney-amountInput"))).toBeVisible();
  });

  it("monto vacío: no navega y permanece en la pantalla", async () => {
    await element(by.id("sendMoney-beneficiaryCard-1")).tap();
    await element(by.id("sendMoney-sendButton")).tap();

    await detoxExpect(element(by.id("sendMoney-amountInput"))).toBeVisible();
  });
});
