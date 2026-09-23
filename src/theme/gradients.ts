import { colors, gradientStops } from "./colors";

type Gradient = {
  colors: string[];
  locations: number[];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

/**
 * Degradados de marca, en el formato que consume
 * `react-native-linear-gradient`. Todos son el mismo par de extremos del PDF
 * (`gradientStops`); solo cambia la direccion.
 */

/** "Get Started", toggle de idioma activo y tarjeta de saldo: horizontal. */
export const primaryGradient: Gradient = {
  colors: [gradientStops.from, gradientStops.to],
  locations: [0, 1],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

/**
 * Variante mas profunda del degradado de marca. La piden las pantallas de
 * seguridad; no sustituye a `primaryGradient`, que es el que ya usan Splash,
 * Login y la tarjeta de saldo.
 */
export const primaryGradientDeep: Gradient = {
  colors: ["#2D14BE", "#5A1EF0"],
  locations: [0, 1],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

/** Relleno del circulo protagonista: de arriba-izquierda a abajo-derecha. */
export const heroCircle: Gradient = {
  colors: [colors.heroCircle.from, colors.heroCircle.to],
  locations: [0, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/** Cuadro del logo: diagonal. */
export const logoTile: Gradient = {
  colors: [gradientStops.to, gradientStops.from],
  locations: [0, 1],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/** @deprecated usa `primaryGradient` */
export const brandDiagonal: Gradient = {
  colors: [gradientStops.to, gradientStops.from],
  locations: [0, 1],
  start: { x: 0.19, y: 0 },
  end: { x: 0.81, y: 1 },
};

/** @deprecated usa `primaryGradient` */
export const brandHorizontal: Gradient = primaryGradient;

export const gradients = {
  primaryGradient,
  primaryGradientDeep,
  heroCircle,
  logoTile,
} as const;
