/**
 * Paleta Remeza. Los valores salen del PDF de diseno de 16 pantallas.
 *
 * Este archivo es la fuente de verdad del tema y **no importa nada**: el resto
 * de `theme/` deriva de aqui. Al final estan los alias con los nombres viejos,
 * que siguen exportados porque los consumen `styles.ts` y las pantallas
 * internas; apuntan ya a los valores nuevos, asi que la app se re-skinea sin
 * tocar cada pantalla.
 */

export const colors = {
  bg: {
    /** Fondo base, el mas oscuro */
    base: "#02021A",
    /** Fondo medio, hacia el que cae el degradado vertical */
    deep: "#05052A",
    /** Resplandores radiales de las esquinas (se usa con opacidad 0.35-0.5) */
    glow: "#3A1CFF",
    /** Resplandor rosado secundario de las zonas bajas (opacidad 0.25) */
    glowPink: "#6A1B8A",
  },

  /** Fondo de inputs y cards */
  surface: "rgba(255,255,255,0.04)",
  /** Fondo del boton cerrar y de los circulos de icono */
  surfaceStrong: "rgba(255,255,255,0.07)",
  /** Borde de inputs y cards */
  border: "rgba(124,92,255,0.45)",
  /** Borde de cards de actividad y botones ghost */
  borderSubtle: "rgba(255,255,255,0.10)",

  /** Botones principales, chip activo y barra de progreso */
  primary: "#4B23FA",
  /** Links ("Paste code", "Show Data") e iconos dentro de circulo */
  primaryLight: "#8774FF",

  text: {
    primary: "#FFFFFF",
    /** Subtitulos */
    secondary: "#A89BD8",
    /** Labels en mayusculas */
    label: "#C9C6E8",
    /** Placeholders y texto deshabilitado */
    placeholder: "#7C7AA8",
  },

  /** Montos positivos */
  success: "#2BF4A5",
  /** Fondo del icono de deposito */
  successBg: "#0F3B3A",
  /** Check de la pantalla de exito */
  successIcon: "#12A457",
  /** Montos negativos */
  danger: "#EF679C",
  /** Fondo del icono de pago */
  dangerBg: "#3A1030",

  badge: {
    virtual: { bg: "#2A1A7A", text: "#FFFFFF" },
    physical: { bg: "#4A4A63", text: "#FFFFFF" },
    remittance: { bg: "#5B1FFF", text: "#FFFFFF" },
    trading: { bg: "#1E4B55", text: "#FFFFFF" },
  },

  /** Segmentos pendientes del stepper */
  progressInactive: "rgba(255,255,255,0.12)",

  /** Link "Contactar soporte" */
  accentMagenta: "#9B4DFF",
  /** Circulos de 48 de las listas de seguridad y multidivisa */
  iconCircleBg: "#1E0D76",
  /**
   * Divisor de las cards agrupadas. Roza el `borderSubtle` (0.10) pero el
   * diseno lo pide a 0.08 y aqui separa filas dentro de una misma card, no
   * cards entre si.
   */
  divider: "rgba(255,255,255,0.08)",

  /** Circulo protagonista de las pantallas de seguridad */
  heroCircle: {
    from: "#1E0D76",
    to: "#3A1AC8",
    ring: "rgba(124,92,255,0.6)",
    /** Trazo del icono: lavanda muy claro */
    icon: "#D7D7F4",
  },

  /**
   * Superficie **opaca** de hojas inferiores y menus desplegables. No sale del
   * PDF: `surfaceStrong` es translucido y dejaria leer el formulario de atras,
   * asi que necesita un solido propio por encima de `bg.deep`.
   */
  sheetSurface: "#141236",

  /* --- Claves planas heredadas. Las pantallas migran en las fases 2-4. --- */
  /** @deprecated usa `colors.bg.base` */
  background: "#02021A",
  /** @deprecated usa `colors.bg.deep` */
  navy: "#05052A",
  /** @deprecated usa `colors.surfaceStrong` */
  indigoDeep: "rgba(255,255,255,0.07)",
  /** @deprecated usa `colors.primary` */
  violet: "#4B23FA",
  /** @deprecated usa `colors.primaryLight` */
  violetBright: "#8774FF",
  /** @deprecated usa `gradientStops.from` */
  purple: "#4114D7",
  /** @deprecated usa `colors.text.primary` */
  textPrimary: "#FFFFFF",
  /** @deprecated usa `colors.text.secondary` */
  textSecondary: "#A89BD8",
  /** @deprecated usa `colors.text.placeholder` */
  textDisabled: "#7C7AA8",
  /** @deprecated usa `colors.border` */
  glassBorder: "rgba(124,92,255,0.45)",
  /** @deprecated usa `colors.surface` */
  glassSurface: "rgba(255,255,255,0.04)",
  /** @deprecated usa `colors.surfaceStrong` */
  glassSurfaceStrong: "rgba(255,255,255,0.07)",
} as const;

/** Extremos del degradado de marca: "Get Started", toggle activo y card de saldo. */
export const gradientStops = {
  from: "#4114D7",
  to: "#8249E4",
} as const;

/* ------------------------------------------------------------------ *
 * Alias heredados
 * ------------------------------------------------------------------ */

export const PURPLE = colors.primaryLight;
export const PURPLE_DEEP = gradientStops.from;
/** @deprecated Se conserva porque aun lo importan algunas pantallas. */
export const PURPLE_DARK = gradientStops.from;

export const BACKGROUND = colors.bg.base;
export const VIOLET = colors.primary;
/** Violeta para texto e iconos: el corporativo se hunde sobre el fondo. */
export const VIOLET_TEXT = colors.primaryLight;

export const TEXT_PRIMARY = colors.text.primary;
export const TEXT_SECONDARY = colors.text.secondary;
export const TEXT_DISABLED = colors.text.placeholder;

export const GLASS_SURFACE = colors.surface;
export const GLASS_SURFACE_STRONG = colors.surfaceStrong;
export const SHEET_SURFACE = colors.sheetSurface;
export const GLASS_BORDER = colors.border;
export const VIOLET_SURFACE = "rgba(75,35,250,0.18)";
export const VIOLET_BORDER = colors.border;

export const DANGER = colors.danger;
/** Rojo macizo, para botones destructivos (el `danger` claro se lava). */
export const DANGER_SOLID = "#B81E5E";
export const DANGER_SURFACE = colors.dangerBg;
export const DANGER_BORDER = "rgba(239,103,156,0.35)";

export const SUCCESS = colors.success;
export const SUCCESS_SURFACE = colors.successBg;
export const SUCCESS_BORDER = "rgba(43,244,165,0.35)";

export const WARNING = "#FBBF24";
export const WARNING_SURFACE = "rgba(251,191,36,0.16)";

/** Velos de los modales, sobre fondo ya oscuro. */
export const SCRIM = "rgba(2,2,26,0.72)";
export const SCRIM_SOFT = "rgba(2,2,26,0.45)";
