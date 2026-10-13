import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CreditCard } from "lucide-react-native";

import {
  InfoCard,
  ScreenHeader,
  ScreenLayout,
  SecondaryButton,
  TransactionRow,
} from "../components/ui";
import { tokens } from "../theme/colors";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { CardMovementsState, CardStatement } from "../api/cardTransactions";

export type { CardMovementsState };

type Props = {
  t: any;
  state: CardMovementsState;
  onBack: () => void;
  onRetry: () => void;
};

function cardName(t: any, card: CardStatement["card"]): string | null {
  if (!card) return null;
  const name =
    card.type === "physical"
      ? t.cardMovementsCardPhysical
      : card.type === "virtual"
        ? t.cardMovementsCardVirtual
        : t.cardMovementsCard;
  return card.last4 ? `${name} •••• ${card.last4}` : name;
}

/**
 * Movimientos de la tarjeta (en que gasto el cliente), leidos de BlackPay por
 * GET /api/v1/transactions/card. Es distinta de "Transacciones", que son los
 * envios de /api/v1/orders. Tiene sus tres estados: carga, error (el backend
 * contesta 503 cuando BlackPay no responde) y vacio.
 */
export default function CardMovementsScreen({ t, state, onBack, onRetry }: Props) {
  const statement = state.status === "ready" ? state.statement : null;
  const card = statement ? cardName(t, statement.card) : null;

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="cardMovements-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={CreditCard}
        title={t.cardMovementsTitle}
        subtitle={t.cardMovementsSubtitle}
        style={styles.header}
      />

      {statement ? (
        <View style={styles.meta}>
          {card ? (
            <Text testID="cardMovements-cardLabel" style={styles.cardLabel}>
              {card}
            </Text>
          ) : null}
          {statement.from && statement.to ? (
            <Text testID="cardMovements-period" style={styles.period}>
              {t.cardMovementsPeriod
                .replace("{from}", statement.from)
                .replace("{to}", statement.to)}
            </Text>
          ) : null}
        </View>
      ) : null}

      {state.status === "loading" ? (
        <View testID="cardMovements-loading" style={styles.loading}>
          <ActivityIndicator color={tokens.textPrimary} />
          <Text style={styles.period}>{t.cardMovementsLoading}</Text>
        </View>
      ) : null}

      {state.status === "error" ? (
        <View style={styles.list}>
          <InfoCard
            testID="cardMovements-error"
            tone="danger"
            title={t.cardMovementsErrorTitle}
            text={t.cardMovementsError}
          />
          <SecondaryButton
            testID="cardMovements-retryButton"
            title={t.cardMovementsRetry}
            onPress={onRetry}
          />
        </View>
      ) : null}

      {statement ? (
        <View style={styles.list}>
          {statement.movements.length === 0 ? (
            <InfoCard testID="cardMovements-empty" text={t.cardMovementsEmpty} />
          ) : (
            statement.movements.map((item) => (
              <TransactionRow
                key={item.id}
                testID={`cardMovements-item-${item.id}`}
                title={item.title}
                date={item.date}
                // Sin `direction` no se sabe si entra o sale: va el tipo tal cual.
                status={item.transactionType || undefined}
                amount={item.amount}
                currency="USD"
              />
            ))
          )}
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  meta: {
    gap: 2,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    ...textStyles.rowTitle,
  },
  period: {
    ...textStyles.caption,
  },
  loading: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  list: {
    gap: metrics.rowGap,
  },
});
