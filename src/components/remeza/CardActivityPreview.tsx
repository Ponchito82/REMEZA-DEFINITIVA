import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { GlassCard } from "../ui";
import ActivityItem from "./ActivityItem";
import type { CardMovementsState } from "../../api/cardTransactions";

type Props = {
  t: any;
  state: CardMovementsState;
  /** Cuantos movimientos caben en la vista previa */
  limit: number;
  /** Prefijo de los testID de cada fila (p. ej. "dashboard-activityItem") */
  itemTestID: string;
};

/**
 * Seccion "Actividad" del Home y del detalle de tarjeta: los ultimos
 * movimientos reales de la tarjeta (BlackPay), con los mismos estados que la
 * pantalla completa. Los montos van sin signo porque todavia no llega
 * `direction`.
 */
export default function CardActivityPreview({ t, state, limit, itemTestID }: Props) {
  if (state.status === "loading") {
    return (
      <GlassCard flush style={styles.message} testID={`${itemTestID}-loading`}>
        <ActivityIndicator color={colors.text.primary} />
        <Text style={typography.caption}>{t.cardMovementsLoading}</Text>
      </GlassCard>
    );
  }

  if (state.status === "error") {
    return (
      <GlassCard flush style={styles.message} testID={`${itemTestID}-error`}>
        <Text style={[typography.caption, styles.center]}>{t.cardMovementsErrorTitle}</Text>
      </GlassCard>
    );
  }

  const movements = state.statement.movements.slice(0, limit);

  if (movements.length === 0) {
    return (
      <GlassCard flush style={styles.message} testID={`${itemTestID}-empty`}>
        <Text style={[typography.caption, styles.center]}>{t.cardMovementsEmpty}</Text>
      </GlassCard>
    );
  }

  return (
    <View style={styles.list}>
      {movements.map((item, index) => (
        <ActivityItem
          key={item.id}
          testID={`${itemTestID}-${index}`}
          label={item.title}
          subtitle={[item.date, item.transactionType].filter(Boolean).join(" · ")}
          amount={item.amount}
          direction="neutral"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  message: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderColor: colors.borderSubtle,
  },
  center: {
    textAlign: "center",
  },
});
