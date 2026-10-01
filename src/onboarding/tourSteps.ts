import { ViewName } from "../types/app";

/** Condicion real que cierra un paso de accion (ver `TourStep.awaitAction`). */
export type TourAwait =
  | { type: "menuOpen" }
  | { type: "view"; value: ViewName }
  | { type: "guidePress" };

export type TourStep = {
  titleKey: string;
  descriptionKey: string;
  /** Id registrado con `tourRef` del componente a enmarcar; sin id, solo se muestra la tarjeta. */
  targetId?: string;
  /**
   * Si esta presente, el paso NO tiene boton "Siguiente": el usuario debe
   * realizar esta accion real en la app (navegar, abrir el menu, etc.) y
   * `App.tsx` detecta la condicion para avanzar solo. Sin esto, el paso
   * avanza con el boton normal.
   */
  awaitAction?: TourAwait;
};

/**
 * Guia paso a paso: mensajes en una tarjeta que no bloquea la pantalla, con
 * un cuadro (sin atenuar el fondo) alrededor del componente explicado. Los
 * ultimos pasos (desde "menu") son interactivos: no avanzan solos, esperan a
 * que el usuario toque el elemento real correspondiente.
 */
export const TOUR_STEPS: TourStep[] = [
  { titleKey: "tourWelcomeTitle", descriptionKey: "tourWelcomeDesc" },
  { titleKey: "tourBalanceTitle", descriptionKey: "tourBalanceDesc", targetId: "balance" },
  { titleKey: "tourHideTitle", descriptionKey: "tourHideDesc", targetId: "hideToggle" },
  { titleKey: "tourSendTitle", descriptionKey: "tourSendDesc", targetId: "send" },
  { titleKey: "tourCardPhysicalTitle", descriptionKey: "tourCardPhysicalDesc", targetId: "cardPhysical" },
  { titleKey: "tourCardVirtualTitle", descriptionKey: "tourCardVirtualDesc", targetId: "cardVirtual" },
  { titleKey: "tourActivityTitle", descriptionKey: "tourActivityDesc", targetId: "activity" },

  // --- Tramo final interactivo: cada paso espera la accion real del usuario ---
  {
    titleKey: "tourMenuTitle",
    descriptionKey: "tourMenuDesc",
    targetId: "menu",
    awaitAction: { type: "menuOpen" },
  },
  {
    titleKey: "tourProfileTitle",
    descriptionKey: "tourProfileDesc",
    targetId: "drawerProfile",
    awaitAction: { type: "view", value: "profile" },
  },
  {
    titleKey: "tourHelpCenterTitle",
    descriptionKey: "tourHelpCenterDesc",
    targetId: "profileHelpCenter",
    awaitAction: { type: "view", value: "support" },
  },
  {
    titleKey: "tourBackTitle",
    descriptionKey: "tourBackDesc",
    targetId: "helpCenterBack",
    awaitAction: { type: "view", value: "profile" },
  },
  {
    titleKey: "tourSecurityTitle",
    descriptionKey: "tourSecurityDesc",
    targetId: "profileSecurity",
    awaitAction: { type: "view", value: "security" },
  },
  {
    titleKey: "tourBackTitle",
    descriptionKey: "tourBackDesc",
    targetId: "securityBack",
    awaitAction: { type: "view", value: "profile" },
  },
  {
    titleKey: "tourHelpCenterTitle",
    descriptionKey: "tourHelpCenterDesc",
    targetId: "profileHelpCenter",
    awaitAction: { type: "view", value: "support" },
  },
  {
    titleKey: "tourGuideTitle",
    descriptionKey: "tourGuideDesc",
    targetId: "helpCenterGuide",
    awaitAction: { type: "guidePress" },
  },
  { titleKey: "tourDoneTitle", descriptionKey: "tourDoneDesc" },
];
