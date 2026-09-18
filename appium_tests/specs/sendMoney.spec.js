const { byId, clickWithRetry, restartApp, hideKeyboard } = require("../helpers");

const goToSendMoney = async () => {
  await restartApp();
  await byId("login-phoneInput").setValue("+525538068807");
  await byId("login-accessCodeInput").setValue("123456");
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").click();
  await byId("drawer-sendMoneyItem").click();
};

describe("Enviar dinero (SendMoneyView)", () => {
  beforeEach(async () => {
    await goToSendMoney();
  });

  it("camino feliz: beneficiario + monto válido navega a confirmación", async () => {
    await byId("sendMoney-beneficiaryCard-1").click();
    await byId("sendMoney-amountInput").setValue("100");
    await hideKeyboard();
    await clickWithRetry("sendMoney-sendButton");

    await byId("sendMoneyConfirmation-confirmButton").waitForDisplayed({
      timeout: 10000,
    });
  });

  it("fondos insuficientes: monto mayor al saldo muestra mensaje de error", async () => {
    await byId("sendMoney-beneficiaryCard-1").click();
    await byId("sendMoney-amountInput").setValue("999999");
    await hideKeyboard();
    await clickWithRetry("sendMoney-sendButton");

    await byId("sendMoney-errorMessage").waitForDisplayed({ timeout: 10000 });
  });

  it("sin beneficiario seleccionado: no navega y permanece en la pantalla", async () => {
    await byId("sendMoney-amountInput").setValue("100");
    await hideKeyboard();
    await clickWithRetry("sendMoney-sendButton");

    await expect(byId("sendMoney-amountInput")).toBeDisplayed();
  });

  it("monto vacío: no navega y permanece en la pantalla", async () => {
    await byId("sendMoney-beneficiaryCard-1").click();
    await clickWithRetry("sendMoney-sendButton");

    await expect(byId("sendMoney-amountInput")).toBeDisplayed();
  });
});
