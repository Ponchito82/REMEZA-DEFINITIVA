import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { radius } from "../../theme/radius";

export type BadgeVariant = "virtual" | "physical" | "remittance";

type Props = {
  label: string;
  variant: BadgeVariant;
  style?: ViewStyle;
  testID?: string;
};

/** Pastilla que clasifica una transaccion por producto. */
export default function Badge({ label, variant, style, testID }: Props) {
  const tone = colors.badge[variant];

  return (
    <View testID={testID} style={[styles.root, { backgroundColor: tone.bg }, style]}>
      <Text style={[styles.label, { color: tone.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    includeFontPadding: false,
  },
});
