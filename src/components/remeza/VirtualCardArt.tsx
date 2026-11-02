import React from "react";
import { View, Image, StyleSheet, StyleProp, ViewStyle } from "react-native";

/** Misma proporcion que PhysicalCardArt (810x509). */
const ASPECT_RATIO = 810 / 509;

export type VirtualCardColor = "white" | "black" | "purple";
export type VirtualCardArtColor = VirtualCardColor | "glass";

const SOURCES = {
  white: require("../../assets/virtual-card.jpg"),
  black: require("../../assets/virtual-card-black.jpg"),
  purple: require("../../assets/virtual-card-purple.jpg"),
  /** Morado translucido: solo la vista previa de "Nueva tarjeta". */
  glass: require("../../assets/virtual-card-glass.png"),
};

type Props = {
  /** Colorway; por defecto la blanca. */
  color?: VirtualCardArtColor;
  /** Ancho en dp; todo lo demas escala con el. */
  width: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Frente de la tarjeta virtual Remeza: el mismo diseno de la fisica con los
 * colores cambiados (blanca con letras moradas, negra o morada). Solo decorativo.
 */
export default function VirtualCardArt({ width, color = "white", style, testID }: Props) {
  const height = width / ASPECT_RATIO;
  const isGlass = color === "glass";
  // El PNG translucido trae las esquinas redondeadas con radio 30/810.
  const borderRadius = width * (isGlass ? 30 / 810 : 0.045);

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.root, color === "glass" && styles.glass, { width, height, borderRadius }, style]}
    >
      <Image
        source={SOURCES[color]}
        style={{ width, height, borderRadius }}
        resizeMode="cover"
      />
      {isGlass ? <View style={[styles.glassBorder, { borderRadius }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Margen marcado de la tarjeta translucida. */
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(150,125,255,0.95)",
  },
  /** Sin fondo ni sombra: solo se ve el morado translucido. */
  glass: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  root: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
});
