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

describe("Soporte y Centro de ayuda [backend]", () => {
  beforeEach(async () => {
    await goToProfile();
  });

  it("Soporte en vivo ofrece chat, ticket y llamada, sin el atajo al Centro de ayuda", async () => {
    await byId("profile.supportRow").click();

    await byId("liveSupport.backButton").waitForDisplayed({ timeout: 10000 });
    await expect(byId("liveSupport.chatRow")).toBeDisplayed();
    await expect(byId("liveSupport.ticketRow")).toBeDisplayed();
    await expect(byId("liveSupport.callRow")).toBeDisplayed();
    await expect($('//*[@text="+1 (773) 263-1785"]')).toBeDisplayed();
    await expect(byId("liveSupport.helpCenterRow")).not.toBeExisting();
  });

  it("el Centro de ayuda ya no tiene 'Cancelar o disputar'", async () => {
    await byId("profile.helpCenterRow").click();

    await byId("helpCenter.backButton").waitForDisplayed({ timeout: 10000 });
    await expect(byId("helpCenter.topic.faq")).toBeDisplayed();
    await expect(byId("helpCenter.disputeRow")).not.toBeExisting();
  });

  it("'Preguntas frecuentes' abre su propia pantalla con preguntas desplegables", async () => {
    await byId("profile.helpCenterRow").click();
    await byId("helpCenter.topic.faq").click();

    await byId("faq.backButton").waitForDisplayed({ timeout: 10000 });
    await expect(byId("faq.section.about")).toBeDisplayed();

    await byId("faq.question.about-0").click();
    await byId("faq.answer.about-0").waitForDisplayed({ timeout: 5000 });

    await byId("faq.question.about-0").click();
    await expect(byId("faq.answer.about-0")).not.toBeExisting();
  });

  it("el botón de regresar de Preguntas frecuentes vuelve al Centro de ayuda", async () => {
    await byId("profile.helpCenterRow").click();
    await byId("helpCenter.topic.faq").click();
    await byId("faq.backButton").waitForDisplayed({ timeout: 10000 });

    await byId("faq.backButton").click();

    await byId("helpCenter.backButton").waitForDisplayed({ timeout: 10000 });
  });
});
