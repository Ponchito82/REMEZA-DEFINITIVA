import { ViewName } from "../types/app";

/** Condicion real que cierra un paso de accion (ver `TourStep.awaitAction`). */
export type TourAwait =
  | { type: "menuOpen" }
  | { type: "view"; value: ViewName }
  | { type: "guidePress" };

export type TourStep = {
  titleKey: string;
  descriptionKey: string;
  /** Texto del chip sobre el cuadro, si debe ser mas corto que el titulo. */
  chipKey?: string;
  /** Id registrado con `tourRef` del componente a enmarcar; sin id, solo se muestra la tarjeta. */
  targetId?: string;
  /**
   * Varios ids a enmarcar a la vez en el mismo paso (p. ej. ambas tarjetas).
   * Se usa en lugar de `targetId`; el chip con el titulo va en el primero.
   */
  targetIds?: string[];
  /**
   * `false` deja la pantalla con su apariencia normal (sin atenuar). Solo
   * tiene sentido en pasos sin objetivo, como introduccion a una pantalla.
   */
  dimBackground?: boolean;
  /** Clave de texto para el boton en lugar de "Siguiente" (p. ej. "Continuar"). */
  nextLabelKey?: string;
  /*
   * Si esta presente, el paso NO tiene boton "Siguiente": el usuario debe
   * realizar esta accion real en la app (navegar, abrir el menu, etc.) y
   * `App.tsx` detecta la condicion para avanzar solo. Sin esto, el paso
   * avanza con el boton normal.
   */
  awaitAction?: TourAwait;
  /** Muestra los datos de la tarjeta durante el paso (los iconos de copiar solo existen asi). */
  revealCardData?: boolean;
};

/** Ids a enmarcar de un paso, sea con `targetId` o con `targetIds`. */
export function stepTargetIds(step: TourStep): string[] {
  if (step.targetIds) return step.targetIds;
  return step.targetId ? [step.targetId] : [];
}

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

  // --- Mi tarjeta (virtual): de lo general a cada control, en el orden en que se ven ---
  { titleKey: "tourVirtualCardTitle", descriptionKey: "tourVirtualCardDesc", targetId: "cardVirtual" },
  {
    titleKey: "tourCardDataTitle",
    descriptionKey: "tourCardDataDesc",
    // El chip va en el primero: "Ver datos".
    targetIds: ["cardShowData", "cardCopyNumber", "cardCopyCvv"],
    revealCardData: true,
  },
  {
    titleKey: "tourCardStatusTitle",
    descriptionKey: "tourCardStatusDesc",
    chipKey: "tourCardStatusChip",
    targetId: "cardStatus",
  },
  { titleKey: "tourCardDetailsTitle", descriptionKey: "tourCardDetailsDesc", targetId: "cardDetails" },

  // Tarjeta fisica: si el usuario ya cerro la seccion o la activo, el paso
  // queda sin cuadro y solo se muestra el mensaje.
  { titleKey: "tourPhysicalCardTitle", descriptionKey: "tourPhysicalCardDesc", targetId: "cardPhysical" },

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
  // Introduccion al Centro de ayuda: pantalla sin atenuar y sin objetivo.
  {
    titleKey: "tourHelpCenterIntroTitle",
    descriptionKey: "tourHelpCenterIntroDesc",
    dimBackground: false,
    nextLabelKey: "tourContinue",
  },
  {
    titleKey: "tourGuideTitle",
    descriptionKey: "tourGuideDesc",
    targetId: "helpCenterGuide",
    awaitAction: { type: "guidePress" },
  },
  { titleKey: "tourDoneTitle", descriptionKey: "tourDoneDesc" },
];
