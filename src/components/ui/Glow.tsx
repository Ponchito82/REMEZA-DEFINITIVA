import React from "react";
import { Platform, StyleSheet, StyleProp, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  children: React.ReactNode;
  /** Radio del desenfoque, en dp. Maximo 20: mas que eso se lee como neblina. */
  radius: number;
  /** Opacidad del brillo. Maximo 0.45. */
  opacity: number;
  /** Desplazamiento vertical, en dp */
  offsetY?: number;
  /** Radio de las esquinas de la pieza que brilla */
  corner: number;
  /** La pieza ocupa todo el ancho disponible */
  stretch?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Brillo de color en **una sola capa**. Apilar Views con opacidad decreciente
 * para simular un halo es lo que dibuja los anillos escalonados: cada capa
 * aporta un escalon y el ojo los lee como contornos.
 *
 * iOS usa la sombra nativa, que sale lisa. Android no colorea la sombra
 * nativa, asi que va `react-native-shadow-2`, que dibuja un degradado SVG.
 */
export default function Glow({
  children,
  radius,
  opacity,
  offsetY = 0,
  corner,
  stretch = false,
  style,
}: Props) {
  /**
   * Android: `boxShadow`, que desenfoca con una gaussiana. Se probo
   * `react-native-shadow-2` y dibuja el halo como una rampa **lineal** a lo
   * largo de `distance`, asi que el degradado se corta de golpe al final y el
   * contorno se ve — justo el borde duro que hay que evitar.
   */
  const shadow = Platform.select({
    android: { boxShadow: `0px ${offsetY}px ${radius}px rgba(75,35,250,${opacity})` },
    default: {
      shadowColor: colors.primary,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
  });

  return (
    <View
      style={[
        { borderRadius: corner },
        shadow,
        stretch && styles.stretch,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stretch: {
    alignSelf: "stretch",
  },
});
