const { byId, clickWithRetry, hideKeyboard, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToProfile = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-profileItem").click();

  await byId("profile-backButton").waitForDisplayed({ timeout: 10000 });
};

describe("Edición de perfil (ProfileView) [backend]", () => {
  beforeEach(async () => {
    await goToProfile();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("profile-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("edita email y dirección y guarda: muestra el mensaje de éxito (handleProfileSave = setState puro)", async () => {
    await byId("profile-emailInput").setValue("adrian.morfin@example.com");
    await byId("profile-addressInput").setValue("456 Elm Street");
    await hideKeyboard();

    await clickWithRetry("profile-saveButton");

    await expect($('//*[@text="Your profile was updated successfully."]')).toBeDisplayed();
  });
});
