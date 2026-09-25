import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { SvgUri } from "react-native-svg";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { initialsOf } from "./Avatar";

type Props = {
  name: string;
  /** Logo del comercio en SVG, si el servicio lo manda */
  svgUrl?: string;
  size?: number;
  /** `square` para bancos, `circle` para comercios */
  shape?: "circle" | "square";
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Logo de un tercero. No se incrustan logos en la app: si el servicio manda
 * una URL SVG se pinta esa; si no, las iniciales.
 */
export default function MerchantAvatar({
  name,
  svgUrl,
  size = 52,
  shape = "circle",
  style,
  testID,
}: Props) {
  const corner = shape === "circle" ? size / 2 : 12;

  return (
    <View
      testID={testID}
      accessibilityLabel={name}
      style={[styles.root, { width: size, height: size, borderRadius: corner }, style]}
    >
      {svgUrl ? (
        <SvgUri uri={svgUrl} width={size * 0.7} height={size * 0.7} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initialsOf(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.iconCircle,
  },
  initials: {
    fontFamily: fontFamily.semibold,
    includeFontPadding: false,
    color: tokens.iconAccent,
  },
});
