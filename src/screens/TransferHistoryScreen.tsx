import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  InfoCard,
  ScreenLayout,
  SegmentedTabs,
  TransactionRow,
} from "../components/ui";
import { tokens } from "../theme/colors";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { Transaction, TransactionStatus } from "../types/app";

type Props = {
  t: any;
  transactions: Transaction[];
  onBack: () => void;
  onOpen: (id: string) => void;
};

type Tab = "all" | "sent" | "received";

const STATUS_COLOR: Record<TransactionStatus, string> = {
  completed: tokens.successText,
  pending: tokens.warningText,
  cancelled: tokens.dangerText,
};

/**
 * Historial (pantalla 14), desde Enviar dinero. "Enviados" son las remesas;
 * "Recibidos", los movimientos con monto positivo.
 */
export default function TransferHistoryScreen({ t, transactions, onBack, onOpen }: Props) {
  const [tab, setTab] = useState<Tab>("all");

  const statusLabels: Record<TransactionStatus, string> = {
    completed: t.statusCompleted,
    pending: t.statusPending,
    cancelled: t.statusCancelled,
  };

  const visible = transactions.filter((item) => {
    if (tab === "sent") return item.type === "remittance";
    if (tab === "received") return item.amount.trim().startsWith("+");
    return true;
  });

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="transferHistory.backButton"
      backAccessibilityLabel={t.back}
    >
      <Text style={[textStyles.title, styles.title]}>{t.historyTitle}</Text>

      <SegmentedTabs
        testID="transferHistory.tab"
        items={[
          { label: t.historyAll, value: "all" },
          { label: t.historySent, value: "sent" },
          { label: t.historyReceived, value: "received" },
        ]}
        value={tab}
        onChange={(value) => setTab(value as Tab)}
        style={styles.tabs}
      />

      <View style={styles.list}>
        {visible.length === 0 ? (
          <InfoCard text={t.noTransactions} />
        ) : (
          visible.map((item) => (
            <TransactionRow
              key={item.id}
              testID={`transferHistory.item.${item.id}`}
              title={item.beneficiary ?? item.label}
              date={item.date}
              status={statusLabels[item.status]}
              statusColor={STATUS_COLOR[item.status]}
              amount={item.amount}
              currency="USD"
              struck={item.status === "cancelled"}
              onPress={() => onOpen(item.id)}
            />
          ))
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  tabs: {
    marginBottom: spacing.xl,
  },
  list: {
    gap: metrics.rowGap,
  },
});
