const { byId, clickWithRetry, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToPhysicalCard = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-physicalCardItem").click();

  await byId("physicalCard-backButton").waitForDisplayed({ timeout: 10000 });
};

describe("Confirmación de tarjeta física (PhysicalCardView) [backend]", () => {
  beforeEach(async () => {
    await goToPhysicalCard();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("physicalCard-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("muestra la dirección de entrega sin campos editables ni avisos de KYC", async () => {
    await expect(byId("physicalCard-addressValue")).toBeDisplayed();
    await expect($('//*[@text="This is the address where your card will be shipped."]')).toBeDisplayed();
    await expect(byId("physicalCard-kycNotice")).not.toBeExisting();
    await expect(byId("physicalCard-zipCodeInput")).not.toBeExisting();
    await expect(byId("physicalCard-streetInput")).not.toBeExisting();
  });

  it("confirmar la tarjeta abre primero la confirmación de la solicitud", async () => {
    await clickWithRetry("physicalCard-confirmButton");

    await expect($('//*[@text="Confirm your request"]')).toBeDisplayed();
    await expect($('//*[@text="Delivery in progress"]')).not.toBeDisplayed();
  });

  it("'Go back' regresa a la dirección sin solicitar la tarjeta", async () => {
    await clickWithRetry("physicalCard-confirmButton");
    await clickWithRetry("physicalCard-goBackButton");

    await expect(byId("physicalCard-confirmButton")).toBeDisplayed();
  });

  it("aceptar la confirmación muestra la entrega en proceso", async () => {
    await clickWithRetry("physicalCard-confirmButton");
    await clickWithRetry("physicalCard-requestButton");

    await expect($('//*[@text="Delivery in progress"]')).toBeDisplayed();
    await expect(byId("physicalCard-shippedTo")).toBeDisplayed();
  });
});
