import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { GlassCard } from "../ui";

type Props = {
  label: string;
  amount: string;
  /** `in` para ingresos (verde), `out` para egresos (rosa) */
  direction: "in" | "out";
  style?: ViewStyle;
  testID?: string;
};

const ICON_SIZE = 48;

/** Fila de actividad reciente del Home. */
export default function ActivityItem({ label, amount, direction, style, testID }: Props) {
  const isIncome = direction === "in";
  const tone = isIncome ? colors.success : colors.danger;
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <GlassCard flush style={[styles.root, style]} testID={testID}>
      <View style={[styles.icon, { backgroundColor: isIncome ? colors.successBg : colors.dangerBg }]}>
        <Icon size={20} color={tone} strokeWidth={2} />
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      <Text
        testID={testID ? `${testID}-amount` : undefined}
        style={[typography.bodyStrong, { color: tone }]}
      >
        {amount}
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderColor: colors.borderSubtle,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...typography.bodyStrong,
    flex: 1,
  },
});
