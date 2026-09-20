import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { fontFamily, fontSize, palette, radii } from "../../theme/designSystem";

type Props = {
  message: string;
  /** "danger" para errores, "info" para avisos neutros */
  tone?: "danger" | "info";
  testID?: string;
  style?: ViewStyle;
};

/** Aviso Liquid Glass para errores y mensajes de sesion. */
export default function GlassBanner({ message, tone = "danger", testID, style }: Props) {
  const isDanger = tone === "danger";

  return (
    <View
      testID={testID}
      style={[
        styles.root,
        {
          backgroundColor: isDanger ? palette.dangerSurface : palette.glassSurface,
          borderColor: isDanger ? palette.dangerBorder : palette.glassBorder,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: isDanger ? palette.danger : palette.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.sm + 4,
    borderWidth: 1,
  },
  text: {
    fontFamily,
    fontSize: fontSize.caption,
    lineHeight: 19,
    fontWeight: "500",
    textAlign: "center",
  },
});
