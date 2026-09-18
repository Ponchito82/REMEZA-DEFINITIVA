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

  it("con el filtro 'All' muestra las 4 transacciones simuladas", async () => {
    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-2")).toBeDisplayed();
    await expect(byId("transactions-item-3")).toBeDisplayed();
    await expect(byId("transactions-item-4")).toBeDisplayed();
  });

  it("filtrar por 'Virtual' deja solo la transacción virtual", async () => {
    await byId("transactions-filterChip-virtual").click();

    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-2")).not.toBeDisplayed();
    await expect(byId("transactions-item-3")).not.toBeDisplayed();
    await expect(byId("transactions-item-4")).not.toBeDisplayed();
  });

  it("filtrar por 'Remittance' deja solo la remesa", async () => {
    await byId("transactions-filterChip-remittance").click();

    await expect(byId("transactions-item-3")).toBeDisplayed();
    await expect(byId("transactions-item-1")).not.toBeDisplayed();
    await expect(byId("transactions-item-2")).not.toBeDisplayed();
    await expect(byId("transactions-item-4")).not.toBeDisplayed();
  });

  it("volver a 'All' después de filtrar restaura las 4 transacciones", async () => {
    await byId("transactions-filterChip-trading").click();
    await byId("transactions-filterChip-all").click();

    await expect(byId("transactions-item-1")).toBeDisplayed();
    await expect(byId("transactions-item-4")).toBeDisplayed();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("transactions-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });
});
