import { ViewStyle } from "react-native";
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
