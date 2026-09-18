const { byId, clickWithRetry, hideKeyboard, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToSendMoneyConfirmation = async (amount) => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-sendMoneyItem").click();

  await byId("sendMoney-beneficiaryCard-1").waitForDisplayed({ timeout: 10000 });
  await byId("sendMoney-beneficiaryCard-1").click();
  await byId("sendMoney-amountInput").setValue(amount);
  await hideKeyboard();
  await clickWithRetry("sendMoney-sendButton");

  await byId("sendMoneyConfirmation-confirmButton").waitForDisplayed({ timeout: 10000 });
};

describe("Confirmación de envío de dinero (SendMoneyConfirmationView) [backend]", () => {
  it("tras un envío exitoso, muestra el mensaje de confirmación", async () => {
    await goToSendMoneyConfirmation("100");

    await expect(byId("sendMoneyConfirmation-successMessage")).toBeDisplayed();
    await expect($('//*[@text="Money sent successfully."]')).toBeDisplayed();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await goToSendMoneyConfirmation("100");

    await byId("sendMoneyConfirmation-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("confirmar de nuevo con el saldo ya reducido muestra 'Insufficient funds.'", async () => {
    await goToSendMoneyConfirmation("2400");

    await clickWithRetry("sendMoneyConfirmation-confirmButton");

    await byId("sendMoneyConfirmation-errorMessage").waitForDisplayed({ timeout: 10000 });
    await expect($('//*[@text="Insufficient funds."]')).toBeDisplayed();
  });
});
