import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

import { Badge, Button, CloseButton, GlassBanner, GlassCard, ScreenHeader } from "../components/ui";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";
import { PROVIDER_NAMES, Transaction, ViewName, canCancelTransaction } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  transaction?: Transaction;
  onCancelTransaction: (id: string) => void;
  /** Ya hay una apelacion enviada para este movimiento */
  appealed: boolean;
};

type DetailRow = { key: string; label: string; value: string };

const formatUsd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatMxn = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

/**
 * Desglose de un movimiento, sea del tipo que sea. Las remesas en proceso
 * dentro de la ventana de 30 minutos se pueden cancelar desde aqui.
 */
export default function TransactionDetailView({
  t,
  setView,
  transaction,
  onCancelTransaction,
  appealed,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  const goBack = () => setView("transactions");

  if (!transaction) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <CloseButton testID="transactionDetail-backButton" onPress={goBack} />
        <ScreenHeader title={t.transactionDetail} style={styles.header} />
      </ScrollView>
    );
  }

  const label = transaction.labelKey ? t[transaction.labelKey] : transaction.label;
  const typeLabel = t[transaction.type];
  const statusLabel = {
    completed: t.statusCompleted,
    pending: t.statusPending,
    cancelled: t.statusCancelled,
  }[transaction.status];

  const isRemittance = transaction.type === "remittance";
  const cancellable = canCancelTransaction(transaction);
  const cancelled = transaction.status === "cancelled";

  const rows: DetailRow[] = [
    { key: "type", label: t.transactionType, value: typeLabel },
    { key: "provider", label: t.operatedBy, value: PROVIDER_NAMES[transaction.provider] },
    { key: "concept", label: t.concept, value: label },
  ];

  if (isRemittance) {
    rows.push(
      { key: "amountUsd", label: t.amountToSendUsd, value: formatUsd(transaction.amountUsd) },
      {
        key: "exchangeRate",
        label: t.exchangeRate,
        value: `1 USD = ${(transaction.exchangeRate ?? 0).toFixed(2)} MXN`,
      },
      {
        key: "amountMxn",
        label: t.amountToReceiveMxn,
        value: formatMxn(transaction.mxnAmount ?? 0),
      },
      { key: "beneficiary", label: t.beneficiary, value: transaction.beneficiary ?? t.notAvailable },
    );
  } else {
    rows.push({ key: "amount", label: t.amountLabel, value: transaction.amount });
  }

  rows.push(
    { key: "date", label: t.dateLabel, value: transaction.date },
    { key: "status", label: t.status, value: statusLabel },
    { key: "reference", label: t.referenceLabel, value: transaction.reference },
  );

  const handleConfirmCancel = () => {
    onCancelTransaction(transaction.id);
    setConfirming(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CloseButton testID="transactionDetail-backButton" onPress={goBack} />

      <ScreenHeader
        title={t.transactionDetail}
        subtitle={isRemittance && !cancelled ? t.remittanceCancelationInfo : undefined}
        style={styles.header}
      />

      <GlassCard size="lg" style={[styles.solid, styles.hero]}>
        <Badge label={typeLabel} variant={transaction.type} />
        <Text
          testID="transactionDetail-amount"
          style={[
            typography.display,
            styles.heroAmount,
            cancelled && styles.heroAmountCancelled,
          ]}
        >
          {transaction.amount}
        </Text>
        <Text style={typography.caption}>{statusLabel}</Text>
      </GlassCard>

      <GlassCard size="lg" style={[styles.solid, styles.rows]}>
        {rows.map((row, index) => (
          <View
            key={row.key}
            style={[styles.row, index < rows.length - 1 && styles.rowDivider]}
          >
            <Text style={[typography.caption, styles.rowLabel]}>{row.label}</Text>
            <Text
              testID={`transactionDetail-${row.key}`}
              style={[typography.bodyStrong, styles.rowValue]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </GlassCard>

      {cancelled ? (
        <GlassBanner
          testID="transactionDetail-cancelledBanner"
          tone="info"
          message={t.operationCancelled}
          style={styles.notice}
        />
      ) : null}

      {isRemittance && !cancelled && !cancellable ? (
        <GlassBanner
          testID="transactionDetail-notCancellable"
          tone="info"
          message={t.cancelNotAvailable}
          style={styles.notice}
        />
      ) : null}

      {cancellable && !confirming ? (
        <Button
          testID="transactionDetail-cancelButton"
          title={t.cancelOperation}
          variant="outline"
          rightAdornment="none"
          onPress={() => setConfirming(true)}
          style={styles.action}
        />
      ) : null}

      {!confirming && appealed ? (
        <GlassBanner
          testID="transactionDetail-appealedBanner"
          tone="info"
          message={t.appealInReview}
          style={styles.notice}
        />
      ) : null}

      {!confirming && !appealed ? (
        <Button
          testID="transactionDetail-appealButton"
          title={t.appealOperation}
          variant="outline"
          rightAdornment="none"
          onPress={() => setView("appeal")}
          style={cancellable ? styles.actionNext : styles.action}
        />
      ) : null}

      {cancellable && confirming ? (
        <GlassCard
          size="lg"
          style={[styles.solid, styles.confirm]}
          testID="transactionDetail-confirmCard"
        >
          <Text style={typography.bodyStrong}>{t.cancelConfirmTitle}</Text>
          <Text style={typography.body}>{t.cancelConfirmMessage}</Text>

          <Button
            testID="transactionDetail-confirmCancelButton"
            title={t.cancelConfirmYes}
            rightAdornment="none"
            onPress={handleConfirmCancel}
          />
          <Button
            testID="transactionDetail-keepButton"
            title={t.cancelConfirmNo}
            variant="outline"
            rightAdornment="none"
            onPress={() => setConfirming(false)}
          />
        </GlassCard>
      ) : null}
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
  /** Superficie opaca, la misma del menu desplegable, para que el fondo no se transparente */
  solid: {
    backgroundColor: colors.sheetSurface,
  },
  hero: {
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  heroAmount: {
    color: colors.text.primary,
  },
  heroAmountCancelled: {
    textDecorationLine: "line-through",
    color: colors.text.secondary,
  },
  rows: {
    paddingVertical: spacing.xs,
  },
  row: {
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    color: colors.text.secondary,
  },
  rowValue: {
    color: colors.text.primary,
  },
  notice: {
    marginTop: spacing.lg,
  },
  action: {
    marginTop: spacing.xl,
  },
  actionNext: {
    marginTop: spacing.md,
  },
  confirm: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
