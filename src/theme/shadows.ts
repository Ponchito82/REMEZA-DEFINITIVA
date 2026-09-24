import { Platform, ViewStyle } from "react-native";
import { colors } from "./colors";

/** Glow morado del boton primario. */
export const primaryGlow: ViewStyle = {
  shadowColor: colors.primary,
  shadowOpacity: 0.5,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 10,
};

/** Version atenuada, para superficies activas que no son el boton principal. */
export const softGlow: ViewStyle = {
  shadowColor: colors.primary,
  shadowOpacity: 0.35,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
};

export const shadows = { primaryGlow, softGlow } as const;

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Brillo de color en una sola capa, del color que se pida. Topes del diseno:
 * radio 20 y opacidad 0.45; por encima se lee como neblina.
 *
 * Android va con `boxShadow` (gaussiana nativa) y no con `elevation`, que solo
 * da sombra negra; iOS con la sombra nativa. Mismo criterio que `Glow`.
 */
export function colorGlow(
  color: string,
  opacity: number,
  radius: number,
  offsetY = 0,
): ViewStyle {
  const safeOpacity = Math.min(opacity, 0.45);
  const safeRadius = Math.min(radius, 20);

  return Platform.select<ViewStyle>({
    android: { boxShadow: `0px ${offsetY}px ${safeRadius}px ${hexToRgba(color, safeOpacity)}` },
    default: {
      shadowColor: color,
      shadowOpacity: safeOpacity,
      shadowRadius: safeRadius,
      shadowOffset: { width: 0, height: offsetY },
    },
  });
}
