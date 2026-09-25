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
  it("confirmar procesa el envío y muestra la transferencia exitosa con su folio", async () => {
    await goToSendMoneyConfirmation("100");

    await clickWithRetry("sendMoneyConfirmation-confirmButton");

    await byId("transferSuccess.receiptButton").waitForDisplayed({ timeout: 15000 });
    await expect($('//*[@text="Transfer successful"]')).toBeDisplayed();
    await expect(byId("transferSuccess.folio")).toBeDisplayed();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await goToSendMoneyConfirmation("100");

    await byId("sendMoneyConfirmation-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("'Ver comprobante' abre el comprobante con el mismo folio", async () => {
    await goToSendMoneyConfirmation("2400");

    await clickWithRetry("sendMoneyConfirmation-confirmButton");
    await byId("transferSuccess.receiptButton").waitForDisplayed({ timeout: 15000 });
    const folio = await byId("transferSuccess.folio").getText();

    await clickWithRetry("transferSuccess.receiptButton");

    await byId("transferReceipt.shareButton").waitForDisplayed({ timeout: 10000 });
    await expect(byId("transferReceipt.folio")).toHaveText(folio);
  });
});
