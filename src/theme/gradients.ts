import { colors } from "./colors";

type Gradient = {
  colors: string[];
  locations: number[];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

/**
 * Degradados de marca, en el formato que consume
 * `react-native-linear-gradient`.
 */

/** Boton Sign In y pastilla del selector: claro arriba-izquierda. */
export const brandDiagonal: Gradient = {
  colors: [colors.violetBright, colors.violet, colors.purple],
  locations: [0, 0.55, 1],
  start: { x: 0.19, y: 0 },
  end: { x: 0.81, y: 1 },
};

/** Boton "Get Started": oscuro a la izquierda, brillante a la derecha. */
export const brandHorizontal: Gradient = {
  colors: [colors.purple, colors.violet, colors.violetBright],
  locations: [0, 0.5, 1],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

/** Cuadro del logo. */
export const logoTile: Gradient = {
  colors: [colors.violetBright, colors.violet, colors.purple],
  locations: [0, 0.5, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

export const gradients = { brandDiagonal, brandHorizontal, logoTile } as const;
