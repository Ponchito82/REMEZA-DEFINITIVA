import React from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";

import { ChipGroup, CloseButton, GlassCard, ScreenHeader } from "../components/ui";
import { TransactionItem as TransactionRow } from "../components/remeza";
import type { BadgeVariant } from "../components/ui";
import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";
import { Transaction, TransactionsFilter, ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  transactionsFilter: TransactionsFilter;
  setTransactionsFilter: (filter: TransactionsFilter) => void;

  filteredTransactions: Transaction[];
  onSelectTransaction: (id: string) => void;
};

export default function TransactionsView({
  t,
  setView,
  transactionsFilter,
  setTransactionsFilter,
  filteredTransactions,
  onSelectTransaction,
}: Props) {
  const badgeLabels: Record<string, string> = {
    virtual: t.virtual,
    physical: t.physical,
    remittance: t.remittance,
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton testID="transactions-backButton" onPress={() => setView("dashboard")} />

      <ScreenHeader
        title={t.transactionsTitle}
        subtitle={t.transactionsSubtitle}
        style={styles.header}
      />

      <ChipGroup
        testID="transactions-filterChip"
        options={[
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
          <GlassCard>
            <Text style={typography.body}>{t.noTransactions}</Text>
          </GlassCard>
        ) : (
          filteredTransactions.map((item) => (
            <Pressable
              key={item.id}
              testID={`transactions-item-${item.id}`}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => onSelectTransaction(item.id)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <TransactionRow
                badgeLabel={badgeLabels[item.type] ?? item.type}
                variant={item.type as BadgeVariant}
                label={item.label}
                date={item.status === "cancelled" ? `${item.date} · ${t.statusCancelled}` : item.date}
                amount={item.amount}
              />
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  filters: {
    marginBottom: spacing.xxl,
  },
  list: {
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
});
