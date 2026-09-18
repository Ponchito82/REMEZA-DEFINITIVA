const { byId, clickWithRetry, hideKeyboard, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

describe("Trading (TradingView) [bloqueado]", () => {
  it.skip("[bloqueado] inicia y completa KYC, y transfiere fondos entre wallets", async () => {
    await restartApp();
    await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
    await byId("login-phoneInput").setValue(TEST_PHONE);
    await byId("login-accessCodeInput").setValue(TEST_CODE);
    await byId("login-signInButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
    await byId("dashboard-menuButton").click();

    await byId("trading-startKycButton").waitForDisplayed({ timeout: 10000 });
    await byId("trading-startKycButton").click();
    await byId("trading-completeKycButton").click();

    await byId("trading-destinationWalletInput").setValue("WLT-0000-0000-0001");
    await byId("trading-transferAmountInput").setValue("100");
    await hideKeyboard();
    await clickWithRetry("trading-sendTransferButton");

    await expect($('//*[@text="Transfer submitted successfully"]')).toBeDisplayed();
  });

  it.skip("[bloqueado] con monto mayor al fondo disponible, no envía la transferencia", async () => {
  });
});
