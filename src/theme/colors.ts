import { palette } from "./designSystem";

/**
 * Tokens de la identidad Remeza, con los nombres del spec de diseno. Es lo que
 * consumen las pantallas de entrada (Bienvenida y Login) y su libreria de
 * componentes; el resto del archivo son los alias en mayusculas que todavia
 * importan las pantallas internas.
 */
export const colors = {
  /** Fondo de pantalla, status bar y barra de navegacion */
  background: palette.background,
  /** Reservado para modales */
  navy: palette.navy,
  /** Circulo de iconos de input y boton deshabilitado */
  indigoDeep: palette.indigo,
  /** Centro de gradientes, borde con foco, brillos y esferas del fondo */
  violet: palette.violet,
  /** Lado brillante de los gradientes */
  violetBright: palette.violetBright,
  /** Lado profundo de los gradientes */
  purple: palette.purple,
  textPrimary: palette.textPrimary,
  /** Subtitulos y enlaces auxiliares */
  textSecondary: palette.textSecondary,
  /** Placeholders, opcion inactiva y boton deshabilitado */
  textDisabled: palette.textDisabled,
  glassBorder: palette.glassBorder,
  glassSurface: palette.glassSurface,
  /** Superficies grandes (hojas inferiores) que necesitan mas opacidad para leerse */
  glassSurfaceStrong: palette.glassSurfaceStrong,
} as const;

/**
 * Tokens del tema oscuro para las pantallas que todavia usan la hoja de
 * estilos compartida (`styles.ts`). Los valores salen de `designSystem.ts`,
 * que es la paleta del spec: aqui solo se les pone el nombre con el que esas
 * pantallas los consumen.
 */

/** Acento de la app. Lo importan ~14 pantallas para iconos y realces. */
export const PURPLE = palette.violetBright;
export const PURPLE_DEEP = palette.purple;
/** @deprecated Se conserva porque aun lo importan algunas pantallas. */
export const PURPLE_DARK = palette.purple;

export const BACKGROUND = palette.background;
export const VIOLET = palette.violet;

/** Violeta para texto e iconos: el corporativo se hunde sobre el fondo. */
export const VIOLET_TEXT = "#9B8CFF";

export const TEXT_PRIMARY = palette.textPrimary;
export const TEXT_SECONDARY = palette.textSecondary;
export const TEXT_DISABLED = palette.textDisabled;

export const GLASS_SURFACE = palette.glassSurface;
export const GLASS_SURFACE_STRONG = palette.glassSurfaceStrong;
export const GLASS_BORDER = palette.glassBorder;
export const VIOLET_SURFACE = "rgba(84,32,255,0.18)";
export const VIOLET_BORDER = "rgba(130,110,255,0.38)";

export const DANGER = palette.danger;
/** Rojo macizo, para botones destructivos (el `danger` claro se lava). */
export const DANGER_SOLID = "#C22B4A";
export const DANGER_SURFACE = palette.dangerSurface;
export const DANGER_BORDER = palette.dangerBorder;

export const SUCCESS = "#4ADE80";
export const SUCCESS_SURFACE = "rgba(34,197,94,0.16)";
export const SUCCESS_BORDER = "rgba(74,222,128,0.35)";

export const WARNING = "#FBBF24";
export const WARNING_SURFACE = "rgba(251,191,36,0.16)";

/** Velos de los modales, sobre fondo ya oscuro. */
export const SCRIM = "rgba(2,3,15,0.72)";
export const SCRIM_SOFT = "rgba(2,3,15,0.45)";
