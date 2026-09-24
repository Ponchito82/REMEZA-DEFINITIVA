const { byId, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToTransactions = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-transactionsItem").click();

  await byId("transactions-backButton").waitForDisplayed({ timeout: 10000 });
};

describe("Listado y filtro de transacciones (TransactionsView) [backend]", () => {
  beforeEach(async () => {
    await goToTransactions();
  });

  it("con el filtro 'All' muestra las 3 transacciones simuladas", async () => {
    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-2")).toBeDisplayed();
    await expect(byId("transactions-item-3")).toBeDisplayed();
  });

  it("no existe el filtro de Trading", async () => {
    await expect(byId("transactions-filterChip-trading")).not.toBeExisting();
  });

  it("filtrar por 'Virtual' deja solo la transacción virtual", async () => {
    await byId("transactions-filterChip-virtual").click();

    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-2")).not.toBeDisplayed();
    await expect(byId("transactions-item-3")).not.toBeDisplayed();
  });

  it("filtrar por 'Remittance' deja solo la remesa", async () => {
    await byId("transactions-filterChip-remittance").click();

    await expect(byId("transactions-item-3")).toBeDisplayed();
    await expect(byId("transactions-item-1")).not.toBeDisplayed();
    await expect(byId("transactions-item-2")).not.toBeDisplayed();
  });

  it("volver a 'All' después de filtrar restaura las 3 transacciones", async () => {
    await byId("transactions-filterChip-physical").click();
    await byId("transactions-filterChip-all").click();

    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-3")).toBeDisplayed();
  });

  it("cualquier movimiento abre su desglose, también uno virtual", async () => {
    await byId("transactions-item-1").click();

    await byId("transactionDetail-backButton").waitForDisplayed({ timeout: 10000 });
    await expect($('//*[@text="Transaction Detail"]')).toBeDisplayed();
    await expect($('//*[@text="+$500.00"]')).toBeDisplayed();
    await expect(byId("transactionDetail-cancelButton")).not.toBeExisting();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("transactions-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });
});
