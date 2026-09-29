export type TourStep = {
  titleKey: string;
  descriptionKey: string;
};

/**
 * Guia paso a paso: solo mensajes centrados, sin resaltar ningun elemento de
 * la pantalla (se probo con recuadros/spotlight y no quedaba bien alineado,
 * asi que se simplifico a esto).
 */
export const TOUR_STEPS: TourStep[] = [
  { titleKey: "tourWelcomeTitle", descriptionKey: "tourWelcomeDesc" },
  { titleKey: "tourBalanceTitle", descriptionKey: "tourBalanceDesc" },
  { titleKey: "tourHideTitle", descriptionKey: "tourHideDesc" },
  { titleKey: "tourSendTitle", descriptionKey: "tourSendDesc" },
  { titleKey: "tourCardPhysicalTitle", descriptionKey: "tourCardPhysicalDesc" },
  { titleKey: "tourCardVirtualTitle", descriptionKey: "tourCardVirtualDesc" },
  { titleKey: "tourActivityTitle", descriptionKey: "tourActivityDesc" },
  { titleKey: "tourMenuTitle", descriptionKey: "tourMenuDesc" },
  { titleKey: "tourSupportTitle", descriptionKey: "tourSupportDesc" },
  { titleKey: "tourAccountTitle", descriptionKey: "tourAccountDesc" },
  { titleKey: "tourDoneTitle", descriptionKey: "tourDoneDesc" },
];
