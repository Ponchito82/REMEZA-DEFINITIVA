import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { Badge, GlassCard } from "../ui";
import type { BadgeVariant } from "../ui";

type Props = {
  badgeLabel: string;
  variant: BadgeVariant;
  label: string;
  /** Formato "MAR 02, 2026" */
  date: string;
  amount: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Fila del historial de transacciones. El monto va en verde solo cuando trae
 * un "+" delante; el resto, remesas incluidas, va en rosa.
 */
export default function TransactionItem({
  badgeLabel,
  variant,
  label,
  date,
  amount,
  style,
  testID,
}: Props) {
  const tone = amount.trim().startsWith("+") ? colors.success : colors.danger;

  return (
    <GlassCard size="lg" style={[styles.root, style]} testID={testID}>
      <Badge label={badgeLabel} variant={variant} />

      <View style={styles.center}>
        <Text style={typography.bodyStrong} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[typography.caption, styles.date]} numberOfLines={1}>
          {date}
        </Text>
      </View>

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
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  center: {
    flex: 1,
  },
  date: {
    marginTop: spacing.xs,
  },
});
