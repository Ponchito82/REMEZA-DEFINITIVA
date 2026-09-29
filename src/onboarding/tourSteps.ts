export type TourStep = {
  titleKey: string;
  descriptionKey: string;
  /** Id registrado con `tourRef` del componente a enmarcar; sin id, solo se muestra la tarjeta. */
  targetId?: string;
};

/**
 * Guia paso a paso: un mensaje por paso en una tarjeta que no bloquea la pantalla
 * y un cuadro (sin atenuar el fondo) alrededor del componente explicado.
 */
export const TOUR_STEPS: TourStep[] = [
  { titleKey: "tourWelcomeTitle", descriptionKey: "tourWelcomeDesc" },
  { titleKey: "tourBalanceTitle", descriptionKey: "tourBalanceDesc", targetId: "balance" },
  { titleKey: "tourHideTitle", descriptionKey: "tourHideDesc", targetId: "hideToggle" },
  { titleKey: "tourSendTitle", descriptionKey: "tourSendDesc", targetId: "send" },
  { titleKey: "tourCardPhysicalTitle", descriptionKey: "tourCardPhysicalDesc", targetId: "cardPhysical" },
  { titleKey: "tourCardVirtualTitle", descriptionKey: "tourCardVirtualDesc", targetId: "cardVirtual" },
  { titleKey: "tourActivityTitle", descriptionKey: "tourActivityDesc", targetId: "activity" },
  { titleKey: "tourMenuTitle", descriptionKey: "tourMenuDesc", targetId: "menu" },
  { titleKey: "tourSupportTitle", descriptionKey: "tourSupportDesc" },
  { titleKey: "tourAccountTitle", descriptionKey: "tourAccountDesc" },
  { titleKey: "tourDoneTitle", descriptionKey: "tourDoneDesc" },
];
