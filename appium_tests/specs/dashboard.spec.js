const { byId, clickWithRetry, hideKeyboard, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToDashboard = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
};

describe("Dashboard — saldo y navegación [backend]", () => {
  beforeEach(async () => {
    await goToDashboard();
  });

  it("muestra el saldo simulado al cargar", async () => {
    await expect(byId("dashboard-balance-label")).toBeDisplayed();
    await expect(byId("dashboard-balance-amount")).toHaveText("$2,450.00");
  });

  it("el botón de menú abre el drawer de navegación", async () => {
    await byId("dashboard-menuButton").click();

    await byId("drawer-profileItem").waitForDisplayed({ timeout: 5000 });
  });

  it("navega a Perfil desde el drawer", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-profileItem").click();

    await byId("profile-backButton").waitForDisplayed({ timeout: 10000 });
  });

  it("navega a Transacciones desde el drawer", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-transactionsItem").click();

    await byId("transactions-backButton").waitForDisplayed({ timeout: 10000 });
  });

  it("navega a la solicitud de tarjeta física desde el drawer", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-physicalCardItem").click();

    await byId("physicalCard-backButton").waitForDisplayed({ timeout: 10000 });
  });

  it("navega a Beneficiarios desde el drawer", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-beneficiariesItem").click();

    await byId("beneficiaries-backButton").waitForDisplayed({ timeout: 10000 });
  });

  it("navega a Enviar dinero desde el drawer", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-sendMoneyItem").click();

    await byId("sendMoney-amountInput").waitForDisplayed({ timeout: 10000 });
  });

  it("cierra el drawer con el botón de cerrar sin cambiar de pantalla", async () => {
    await byId("dashboard-menuButton").click();
    await byId("drawer-closeButton").waitForDisplayed({ timeout: 5000 });
    await byId("drawer-closeButton").click();

    await expect(byId("dashboard-menuButton")).toBeDisplayed();
  });
});

describe("Dashboard — activación de tarjeta física [backend]", () => {
  beforeEach(async () => {
    await goToDashboard();
  });

  it("'Activate Card' deshabilitado hasta llenar los 4 campos del modal físico", async () => {
    await byId("dashboard-activateNowButton").click();

    await byId("dashboard-physicalCardNumberInput").waitForDisplayed({ timeout: 5000 });
    await expect(byId("dashboard-activatePhysicalCardButton")).not.toBeEnabled();
  });

  it("cancelar el modal físico no activa la tarjeta", async () => {
    await byId("dashboard-activateNowButton").click();
    await byId("dashboard-cancelPhysicalCardModalButton").waitForDisplayed({ timeout: 5000 });
    await byId("dashboard-cancelPhysicalCardModalButton").click();

    await byId("dashboard-inactiveCardTitle").waitForDisplayed({ timeout: 5000 });
  });

  it("con los 4 campos válidos, activa la tarjeta física y muestra el mensaje de éxito", async () => {
    await byId("dashboard-physicalCardPressable").click();
    await byId("dashboard-physicalCardNumberInput").waitForDisplayed({ timeout: 5000 });

    await byId("dashboard-physicalCardNumberInput").setValue("1234567812345678");
    await byId("dashboard-expiryDateInput").setValue("1228");
    await byId("dashboard-cvvInput").setValue("123");
    await byId("dashboard-physicalSecureCodeInput").setValue("573920");
    await hideKeyboard();

    await expect(byId("dashboard-activatePhysicalCardButton")).toBeEnabled();
    await clickWithRetry("dashboard-activatePhysicalCardButton");

    await expect($('//*[@text="Congratulations your card is active"]')).toBeDisplayed();
  });
});

describe("Dashboard — activación de tarjeta virtual [backend]", () => {
  beforeEach(async () => {
    await goToDashboard();
  });

  it("cancelar el modal virtual no activa la tarjeta", async () => {
    await byId("dashboard-virtualCardPressable").click();
    await byId("dashboard-cancelVirtualCardModalButton").waitForDisplayed({ timeout: 5000 });
    await byId("dashboard-cancelVirtualCardModalButton").click();

    await byId("dashboard-inactiveCardTitle").waitForDisplayed({ timeout: 5000 });
  });

  it("con birthDate y código virtual válidos, el botón se habilita pero no activa la tarjeta", async () => {
    await byId("dashboard-virtualCardPressable").click();
    await byId("dashboard-birthDateInput").waitForDisplayed({ timeout: 5000 });

    await byId("dashboard-birthDateInput").setValue("01011999");
    await byId("dashboard-virtualSecureCodeInput").setValue("573920");
    await hideKeyboard();

    await expect(byId("dashboard-activateVirtualCardButton")).toBeEnabled();
    await clickWithRetry("dashboard-activateVirtualCardButton");

    await expect(byId("dashboard-virtualSecureCodeInput")).toBeDisplayed();
    await expect(byId("dashboard-inactiveCardTitle")).toBeDisplayed();
  });
});
