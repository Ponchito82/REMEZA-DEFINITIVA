const { byId, clickWithRetry, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToTransactionDetail = async (itemId) => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-transactionsItem").click();

  await byId(`transactions-item-${itemId}`).waitForDisplayed({ timeout: 10000 });
  await byId(`transactions-item-${itemId}`).click();

  await byId("transactionDetail-backButton").waitForDisplayed({ timeout: 10000 });
};

describe("Desglose de movimientos (TransactionDetailView) [backend]", () => {
  it("una remesa muestra monto enviado, tipo de cambio, monto a recibir y beneficiario", async () => {
    await goToTransactionDetail(3);

    await expect($('//*[@text="Transaction Detail"]')).toBeDisplayed();
    await expect(byId("transactionDetail-amountUsd")).toHaveText("$100.00");
    await expect(byId("transactionDetail-exchangeRate")).toHaveText("1 USD = 17.25 MXN");
    await expect(byId("transactionDetail-amountMxn")).toHaveText("$1,725.00 MXN");
    await expect(byId("transactionDetail-beneficiary")).toHaveText("Mario Diaz");
  });

  it("un movimiento de tarjeta muestra su desglose sin opción de cancelar", async () => {
    await goToTransactionDetail(2);

    await expect(byId("transactionDetail-amount")).toHaveText("-$46.20");
    await expect(byId("transactionDetail-reference")).toHaveText("RMZ-000002");
    await expect(byId("transactionDetail-cancelButton")).not.toBeExisting();
  });

  it("cancelar una remesa pide confirmación y la deja como cancelada", async () => {
    await goToTransactionDetail(3);

    await clickWithRetry("transactionDetail-cancelButton");
    await expect($('//*[@text="Cancel this operation?"]')).toBeDisplayed();

    await clickWithRetry("transactionDetail-confirmCancelButton");

    await byId("transactionDetail-cancelledBanner").waitForDisplayed({ timeout: 5000 });
    await expect(byId("transactionDetail-status")).toHaveText("Cancelled");
    await expect(byId("transactionDetail-cancelButton")).not.toBeExisting();
  });

  it("'Keep operation' cierra la confirmación sin cancelar", async () => {
    await goToTransactionDetail(3);

    await clickWithRetry("transactionDetail-cancelButton");
    await clickWithRetry("transactionDetail-keepButton");

    await expect(byId("transactionDetail-cancelButton")).toBeDisplayed();
    await expect(byId("transactionDetail-cancelledBanner")).not.toBeExisting();
  });

  it("indica quién opera el movimiento: Remeza para remesas y BlackPay para tarjeta", async () => {
    await goToTransactionDetail(3);
    await expect(byId("transactionDetail-provider")).toHaveText("Remeza");

    await byId("transactionDetail-backButton").click();
    await byId("transactions-item-2").waitForDisplayed({ timeout: 10000 });
    await byId("transactions-item-2").click();
    await byId("transactionDetail-backButton").waitForDisplayed({ timeout: 10000 });

    await expect(byId("transactionDetail-provider")).toHaveText("BlackPay");
  });

  it("'Dispute' abre su propia pantalla, exige un motivo y deja la disputa en revisión", async () => {
    await goToTransactionDetail(2);

    await clickWithRetry("transactionDetail-appealButton");
    await byId("appeal-backButton").waitForDisplayed({ timeout: 10000 });
    await expect($('//*[@text="Dispute transaction"]')).toBeDisplayed();
    await expect(byId("appeal-submitButton")).toBeDisabled();

    await clickWithRetry("appeal-reasonSelect");
    await $('//*[@text="Duplicate charge"]').click();
    await clickWithRetry("appeal-submitButton");

    await byId("appeal-submittedBanner").waitForDisplayed({ timeout: 5000 });

    await byId("appeal-backButton").click();
    await byId("transactionDetail-appealedBanner").waitForDisplayed({ timeout: 10000 });
    await expect(byId("transactionDetail-appealButton")).not.toBeExisting();
  });

  it("el botón de regresar vuelve al listado de transacciones", async () => {
    await goToTransactionDetail(1);

    await byId("transactionDetail-backButton").click();

    await byId("transactions-backButton").waitForDisplayed({ timeout: 10000 });
  });
});
