const { byId, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToRemittanceDetail = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-transactionsItem").click();

  await byId("transactions-item-3").waitForDisplayed({ timeout: 10000 });
  await byId("transactions-item-3").click();

  await byId("remittanceDetail-backButton").waitForDisplayed({ timeout: 10000 });
};

describe("Detalle de remesa (RemittanceDetail) [backend]", () => {
  beforeEach(async () => {
    await goToRemittanceDetail();
  });

  it("muestra el detalle de la remesa seleccionada", async () => {
    await expect($('//*[@text="Remittance Detail"]')).toBeDisplayed();
    await expect($('//*[@text="$100.00"]')).toBeDisplayed();
    await expect($('//*[@text="$9000.00"]')).toBeDisplayed();
    await expect($('//*[@text="$18.00"]')).toBeDisplayed();
    await expect($('//*[@text="Juan Lopez"]')).toBeDisplayed();
  });

  it("el botón 'Cancel operation' no navega ni rompe la pantalla (handleCancel solo hace console.log)", async () => {
    await byId("remittanceDetail-cancelButton").click();

    await expect($('//*[@text="Remittance Detail"]')).toBeDisplayed();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("remittanceDetail-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });
});
