import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { fontFamily } from "../../theme/typography";

/** Misma proporcion que PhysicalCardArt (tarjeta ID-1). */
const ASPECT_RATIO = 810 / 509;

type Props = {
  /** Ancho en dp; todo lo demas escala con el. */
  width: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Frente de la tarjeta virtual Remeza (blanca). Solo decorativo: no muestra
 * datos del cliente.
 */
export default function VirtualCardArt({ width, style, testID }: Props) {
  const height = width / ASPECT_RATIO;
  const radius = width * 0.07;

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.root, { width, height, borderRadius: radius }, style]}
    >
      <LinearGradient
        colors={["#FFFFFF", "#D9D9E4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          position: "absolute",
          left: width * 0.09,
          top: height * 0.4,
          width: width * 0.16,
          height: height * 0.22,
          borderRadius: width * 0.025,
          backgroundColor: "#B79A7A",
        }}
      />
      <Text
        style={{
          position: "absolute",
          right: width * 0.08,
          top: height * 0.1,
          fontFamily: fontFamily.bold,
          fontSize: width * 0.1,
          color: "#4B23FA",
        }}
      >
        remeza
      </Text>
      <Text
        style={{
          position: "absolute",
          right: width * 0.08,
          bottom: height * 0.1,
          fontFamily: fontFamily.bold,
          fontSize: width * 0.13,
          fontStyle: "italic",
          color: "#4B23FA",
        }}
      >
        VISA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
