import { TextStyle } from "react-native";
import { colors } from "./colors";

/**
 * Escala tipografica del PDF de diseno.
 *
 * El peso se pide por **nombre de familia**, nunca con `fontWeight`: en
 * Android `ReactFontManager` solo resuelve normal y negrita, asi que
 * "Inter" + `fontWeight: "600"` acaba cayendo en la Regular.
 *
 * `includeFontPadding: false` va en todos: Android reserva un hueco vertical
 * propio en cada Text que descuadra el interlineado contra el diseno.
 */
export const fontFamily = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semibold: "Inter-SemiBold",
  bold: "Inter-Bold",
} as const;

const base: TextStyle = { includeFontPadding: false };

export const typography = {
  /** Titulos centrados: "Remeza", "Welcome", "SMS Code" */
  display: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text.primary,
  },
  /** Titulos de pantalla alineados a la izquierda */
  h1: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.primary,
  },
  /** "Activity", "Physical" */
  h2: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text.primary,
  },
  /** Subtitulos */
  body: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  /** Texto de items y valores */
  bodyStrong: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  button: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.text.primary,
  },
  /** Labels de campo, en mayusculas */
  label: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.text.label,
  },
  /** Fechas y helper text */
  caption: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  /** Saldo */
  amount: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.primary,
  },
  cardNumber: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 22,
    letterSpacing: 4,
    color: colors.text.primary,
  },

  /* --- Filas de lista y cards agrupadas --- */
  /** Titulo de una fila de lista */
  listItemTitle: {
    ...base,
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  /** Descripcion de una fila, y label de una card agrupada */
  listItemDescription: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  /** Monto a la derecha de una fila, y codigo de moneda */
  listItemValue: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 22,
    color: colors.text.primary,
  },
  /** Valor de una card agrupada */
  infoValue: {
    ...base,
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },

  /* --- Entradas heredadas. Las pantallas migran en las fases 2-4. --- */
  /** @deprecated usa `display` */
  titleHero: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text.primary,
  },
  /** @deprecated usa `h1` */
  title: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.primary,
  },
  /** @deprecated usa `body` */
  subtitle: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  /** Texto dentro de un TextInput */
  input: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.text.primary,
  },
  /** Opcion del control segmentado */
  segment: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.text.placeholder,
  },
  /** "Forgot your access code?" — el violeta no pasa contraste en 14 dp */
  link: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  /** Fila "Language" del selector de idioma: va en caja alta, no en mayusculas */
  rowLabel: {
    ...base,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text.primary,
  },
  /** "Don't have an account?" */
  footnote: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },
  /** "Sign up", anidado dentro de `footnote` */
  footnoteAccent: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.text.primary,
  },
} as const satisfies Record<string, TextStyle>;
