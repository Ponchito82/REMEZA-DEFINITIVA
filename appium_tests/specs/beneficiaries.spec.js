const { byId, clickWithRetry, hideKeyboard, restartApp } = require("../helpers");

const TEST_PHONE = "+525538068807";
const TEST_CODE = "123456";

const goToBeneficiaries = async () => {
  await restartApp();
  await byId("login-phoneInput").waitForDisplayed({ timeout: 15000 });
  await byId("login-phoneInput").setValue(TEST_PHONE);
  await byId("login-accessCodeInput").setValue(TEST_CODE);
  await byId("login-signInButton").click();

  await byId("dashboard-menuButton").waitForDisplayed({ timeout: 20000 });
  await byId("dashboard-menuButton").click();
  await byId("drawer-beneficiariesItem").click();

  await byId("beneficiaries-backButton").waitForDisplayed({ timeout: 10000 });
};

const openBeneficiaryForm = async () => {
  await clickWithRetry("beneficiaries.addButton");
  await byId("beneficiaries-firstNameInput").waitForDisplayed({ timeout: 10000 });
};

describe("Agregar beneficiario (BeneficiariesView) [backend]", () => {
  beforeEach(async () => {
    await goToBeneficiaries();
  });

  it("el botón de regresar vuelve al Dashboard", async () => {
    await byId("beneficiaries-backButton").click();

    await byId("dashboard-menuButton").waitForDisplayed({ timeout: 10000 });
  });

  it("guardar sin llenar ningún campo no guarda y pide el nombre", async () => {
    await openBeneficiaryForm();
    await clickWithRetry("beneficiaries-saveButton");

    await byId("beneficiaries-validationBanner").waitForDisplayed({ timeout: 5000 });
    await expect($('//*[@text="Enter the first name."]')).toBeDisplayed();
    await expect($('//*[@text="Beneficiary saved successfully."]')).not.toBeDisplayed();
  });

  it("con CLABE incompleta no guarda y pide la CLABE", async () => {
    await openBeneficiaryForm();
    await byId("beneficiaries-firstNameInput").setValue("Ana");
    await byId("beneficiaries-paternalLastNameInput").setValue("García");
    await byId("beneficiaries-phoneInput").setValue("5512345678");
    await byId("beneficiaries-clabeInput").setValue("0123456789");
    await hideKeyboard();

    await clickWithRetry("beneficiaries-saveButton");

    await expect($('//*[@text="Enter the 18-digit CLABE."]')).toBeDisplayed();
    await expect($('//*[@text="Beneficiary saved successfully."]')).not.toBeDisplayed();
  });

  it("llenar el formulario completo, guardar y confirmar muestra el mensaje de éxito", async () => {
    await openBeneficiaryForm();
    await byId("beneficiaries-firstNameInput").setValue("Ana");
    await byId("beneficiaries-paternalLastNameInput").setValue("García");
    await byId("beneficiaries-maternalLastNameInput").setValue("López");
    await byId("beneficiaries-phoneInput").setValue("5512345678");
    await byId("beneficiaries-residenceStateInput").setValue("Jalisco");
    await byId("beneficiaries-residenceCityInput").setValue("Guadalajara");
    await byId("beneficiaries-emailInput").setValue("ana.garcia@example.com");
    await byId("beneficiaries-clabeInput").setValue("012345678901234567");
    await hideKeyboard();

    await clickWithRetry("beneficiaries-saveButton");

    await byId("beneficiaryConfirm.confirmButton").waitForDisplayed({ timeout: 10000 });
    await clickWithRetry("beneficiaryConfirm.confirmButton");

    await expect($('//*[@text="Beneficiary saved successfully."]')).toBeDisplayed();
  });
});
