import React from "react";
import { View, Image, StyleSheet, StyleProp, ViewStyle } from "react-native";

/** Proporcion de la foto recortada (810x509), casi la de una tarjeta ISO/IEC 7810 ID-1. */
const ASPECT_RATIO = 810 / 509;

type Props = {
  /** Ancho en dp; todo lo demas escala con el. */
  width: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Frente de la tarjeta fisica Remeza (foto oficial del diseno). Es solo
 * decorativo: no muestra datos del cliente.
 */
export default function PhysicalCardArt({ width, style, testID }: Props) {
  const height = width / ASPECT_RATIO;
  // La foto trae las esquinas redondeadas con fondo blanco: este radio las recorta.
  const borderRadius = width * 0.045;

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.root, { width, height, borderRadius }, style]}
    >
      <Image
        source={require("../../assets/physical-card.jpg")}
        style={{ width, height, borderRadius }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    backgroundColor: "#3F3F9A",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
});
