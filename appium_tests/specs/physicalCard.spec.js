const {
  byId,
  clickWithRetry,
  hideKeyboard,
  restartApp,
  scrollToId,
  selectFromSearchable,
} = require("../helpers");

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

describe("Solicitud de tarjeta física (PhysicalCardView) [backend]", () => {
  beforeEach(async () => {
    await goToPhysicalCard();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("physicalCard-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("guardar sin llenar la dirección no avanza y pide el código postal", async () => {
    await clickWithRetry("physicalCard-saveAddressButton");

    await byId("physicalCard-validationBanner").waitForDisplayed({ timeout: 5000 });
    await expect($('//*[@text="Delivery in progress"]')).not.toBeDisplayed();
  });

  it("Estado queda bloqueado hasta que el código postal es válido", async () => {
    await expect(await byId("physicalCard-stateSelect")).toBeDisabled();

    await byId("physicalCard-zipCodeInput").setValue("78701");
    await hideKeyboard();

    await expect(await byId("physicalCard-stateSelect")).toBeEnabled();
  });

  it("Ciudad queda bloqueada hasta que hay un Estado seleccionado", async () => {
    await byId("physicalCard-zipCodeInput").setValue("78701");
    await hideKeyboard();

    await expect(await byId("physicalCard-citySelect")).toBeDisabled();

    await selectFromSearchable("physicalCard-stateSelect", "TX", "Texas");

    await expect(await byId("physicalCard-citySelect")).toBeEnabled();
  });

  it("con la dirección llena (ZIP de Estados Unidos), guarda y muestra el resumen", async () => {
    await byId("physicalCard-zipCodeInput").setValue("78701");
    await hideKeyboard();

    await selectFromSearchable("physicalCard-countrySelect", "US", "United");
    await selectFromSearchable("physicalCard-stateSelect", "TX", "Texas");
    await selectFromSearchable("physicalCard-citySelect", "Austin", "Austin");

    await (await scrollToId("physicalCard-streetInput")).setValue("Congress Ave");
    await (await scrollToId("physicalCard-exteriorNumberInput")).setValue("1600");
    await hideKeyboard();

    await clickWithRetry("physicalCard-saveAddressButton");

    await expect($('//*[@text="Delivery in progress"]')).toBeDisplayed();
    await expect($('//*[contains(@text,"Congress Ave")]')).toBeDisplayed();
  });

  it("cambiar de Estado limpia la Ciudad elegida", async () => {
    await byId("physicalCard-zipCodeInput").setValue("78701");
    await hideKeyboard();

    await selectFromSearchable("physicalCard-stateSelect", "TX", "Texas");
    await selectFromSearchable("physicalCard-citySelect", "Austin", "Austin");
    await expect(await byId("physicalCard-citySelect")).toHaveText("Austin");

    await selectFromSearchable("physicalCard-stateSelect", "CA", "California");

    await expect(await byId("physicalCard-citySelect")).not.toHaveText("Austin");
  });
});
