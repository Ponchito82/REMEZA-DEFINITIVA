import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, DANGER_BORDER } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { radius } from "../../theme/radius";

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
          backgroundColor: isDanger ? colors.dangerBg : colors.surface,
          borderColor: isDanger ? DANGER_BORDER : colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: isDanger ? colors.danger : colors.text.secondary }]}>
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
    borderRadius: radius.md,
    borderWidth: 1,
  },
  text: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
