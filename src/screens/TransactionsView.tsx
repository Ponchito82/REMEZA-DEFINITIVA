import React from "react";
import { View, StyleSheet } from "react-native";
import { History } from "lucide-react-native";

import {
  InfoCard,
  ScreenHeader,
  ScreenLayout,
  SegmentedTabs,
  TransactionRow,
} from "../components/ui";
import { tokens } from "../theme/colors";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { Transaction, TransactionStatus, TransactionsFilter, ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  transactionsFilter: TransactionsFilter;
  setTransactionsFilter: (filter: TransactionsFilter) => void;

  filteredTransactions: Transaction[];
  onSelectTransaction: (id: string) => void;
};

const STATUS_COLOR: Record<TransactionStatus, string> = {
  completed: tokens.successText,
  pending: tokens.warningText,
  cancelled: tokens.dangerText,
};

/**
 * Historial de movimientos. Los filtros siguen siendo los de producto
 * (virtual, fisica, remesa): filtran por `type` en `App` y los usan los specs.
 */
export default function TransactionsView({
  t,
  setView,
  transactionsFilter,
  setTransactionsFilter,
  filteredTransactions,
  onSelectTransaction,
}: Props) {
  const statusLabels: Record<TransactionStatus, string> = {
    completed: t.statusCompleted,
    pending: t.statusPending,
    cancelled: t.statusCancelled,
  };

  return (
    <ScreenLayout
      showBack
      onBack={() => setView("dashboard")}
      backTestID="transactions-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={History}
        title={t.transactionsTitle}
        subtitle={t.transactionsSubtitle}
        style={styles.header}
      />

      <SegmentedTabs
        testID="transactions-filterChip"
        items={[
          { label: t.all, value: "all" },
          { label: t.virtual, value: "virtual" },
          { label: t.physical, value: "physical" },
          { label: t.remittance, value: "remittance" },
        ]}
        value={transactionsFilter}
        onChange={(value) => setTransactionsFilter(value as TransactionsFilter)}
        style={styles.filters}
      />

      <View style={styles.list}>
        {filteredTransactions.length === 0 ? (
          <InfoCard text={t.noTransactions} />
        ) : (
          filteredTransactions.map((item) => (
            <TransactionRow
              key={item.id}
              testID={`transactions-item-${item.id}`}
              accessibilityLabel={item.label}
              title={item.label}
              date={item.date}
              status={statusLabels[item.status]}
              statusColor={STATUS_COLOR[item.status]}
              amount={item.amount}
              currency="USD"
              struck={item.status === "cancelled"}
              onPress={() => onSelectTransaction(item.id)}
            />
          ))
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  filters: {
    marginBottom: spacing.xl,
  },
  list: {
    gap: metrics.rowGap,
  },
});
