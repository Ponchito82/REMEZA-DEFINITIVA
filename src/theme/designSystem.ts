import { Platform } from "react-native";

/**
 * Remeza Design System
 * Dark Banking UI + Soft Liquid Glass + Corporate Purple + Minimalism
 */

export const palette = {
  /** Fondo principal */
  background: "#03051D",
  /** Navy secundario */
  navy: "#080B32",
  /** Indigo profundo */
  indigo: "#11104A",
  /** Violeta corporativo */
  violet: "#5420FF",
  /** Violeta brillante */
  violetBright: "#7417FF",
  /** Morado secundario */
  purple: "#3D16C8",
  /** Texto principal */
  textPrimary: "#FFFFFF",
  /** Texto secundario */
  textSecondary: "#B7B4D1",
  /** Texto desactivado */
  textDisabled: "#85819F",
  /** Bordes Liquid Glass */
  glassBorder: "rgba(130,110,255,0.30)",
  /** Superficie Glass */
  glassSurface: "rgba(25,22,70,0.40)",
  /** Superficie Glass elevada (badges e iconos dentro de un campo) */
  glassSurfaceStrong: "rgba(45,40,105,0.55)",
  /** Error sobre fondo oscuro */
  danger: "#FF6B8A",
  dangerSurface: "rgba(120,20,50,0.35)",
  dangerBorder: "rgba(255,107,138,0.35)",
} as const;

/**
 * Familia tipografica: Inter (recomendada) con SF Pro / Roboto del sistema
 * como respaldo. Para activar Inter basta con empaquetar los .ttf
 * (assets/fonts + react-native.config.js) y cambiar USE_INTER a true.
 */
const USE_INTER = false;

export const fontFamily = USE_INTER
  ? Platform.select({ ios: "Inter", android: "Inter", default: "Inter" })
  : undefined;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/** Jerarquia tipografica */
export const fontSize = {
  display: 32,
  title: 28,
  subtitle: 17,
  body: 16,
  control: 16,
  caption: 13,
  micro: 12,
} as const;

export const radii = {
  pill: 999,
  field: 34,
  tile: 34,
  card: 28,
  sm: 14,
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;

/** Resplandor violeta reutilizable para superficies activas */
export const glow = {
  shadowColor: palette.violetBright,
  shadowOpacity: 0.55,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
} as const;

export const softGlow = {
  shadowColor: palette.violet,
  shadowOpacity: 0.35,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
} as const;
