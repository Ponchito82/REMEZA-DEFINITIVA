const { byId, restartApp } = require("../helpers");

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

describe("Perfil de solo lectura (ProfileView) [backend]", () => {
  beforeEach(async () => {
    await goToProfile();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("profile-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("muestra los datos del KYC y el aviso de que no se pueden editar", async () => {
    await expect(byId("profile-fullNameValue")).toBeDisplayed();
    await expect(byId("profile-emailValue")).toBeDisplayed();
    await expect(byId("profile-phoneValue")).toBeDisplayed();
    await expect(byId("profile-addressValue")).toBeDisplayed();
    await expect(byId("profile-readOnlyNotice")).toBeDisplayed();
  });

  it("no hay campos editables ni botón de guardar", async () => {
    await expect(byId("profile-fullNameInput")).not.toBeExisting();
    await expect(byId("profile-emailInput")).not.toBeExisting();
    await expect(byId("profile-addressInput")).not.toBeExisting();
    await expect(byId("profile-saveButton")).not.toBeExisting();
  });
});
