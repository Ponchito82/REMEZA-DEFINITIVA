import { TextStyle } from "react-native";
import { colors } from "./colors";

/**
 * Escala tipografica de las pantallas de entrada.
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
  /** "Remeza" */
  titleHero: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
  },
  /** "Welcome" */
  title: {
    ...base,
    fontFamily: fontFamily.bold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  subtitle: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  button: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  input: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
  segment: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.textDisabled,
  },
  /** "Language" */
  label: {
    ...base,
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  /** "Forgot your access code?" — el violeta no pasa contraste en 14 dp */
  link: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  /** "Don't have an account?" */
  caption: {
    ...base,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  /** "Sign up", anidado dentro de `caption` */
  captionAccent: {
    ...base,
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
} as const satisfies Record<string, TextStyle>;
