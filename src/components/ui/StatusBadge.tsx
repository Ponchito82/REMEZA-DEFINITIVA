import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";

export type StatusKind = "inProgress" | "completed" | "connected" | "cancelled" | "inReview";

type Props = {
  status: StatusKind;
  /** El texto lo pone quien llama (i18n o la logica existente); aqui solo el color. */
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const PALETTE: Record<StatusKind, { text: string; surface: string }> = {
  inProgress: { text: tokens.warningText, surface: tokens.warningSurface },
  inReview: { text: tokens.warningText, surface: tokens.warningSurface },
  completed: { text: tokens.successText, surface: "rgba(22,207,153,0.14)" },
  connected: { text: tokens.successBadgeText, surface: "rgba(44,215,185,0.14)" },
  cancelled: { text: tokens.dangerText, surface: tokens.dangerSurface },
};

/** Pastilla de estado. */
export default function StatusBadge({ status, label, style, testID }: Props) {
  const palette = PALETTE[status];

  return (
    <View style={[styles.root, { backgroundColor: palette.surface }, style]}>
      <View style={[styles.dot, { backgroundColor: palette.text }]} />
      <Text testID={testID} style={[styles.label, { color: palette.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    includeFontPadding: false,
  },
});
