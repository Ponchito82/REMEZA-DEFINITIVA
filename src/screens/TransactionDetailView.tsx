import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  AlertCircle,
  ArrowLeftRight,
  Building2,
  CalendarDays,
  CircleDollarSign,
  CircleX,
  Clock,
  FileText,
  Hash,
  Info,
  Landmark,
  Receipt,
  Tag,
  User,
} from "lucide-react-native";

import {
  Badge,
  DetailRow,
  HeroIcon,
  InfoCard,
  PrimaryButton,
  ProgressBar,
  ScreenHeader,
  ScreenLayout,
  SecondaryButton,
  StatusBadge,
} from "../components/ui";
import type { IconComponent, StatusKind } from "../components/ui";
import { colors, tokens } from "../theme/colors";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  PROVIDER_NAMES,
  REMITTANCE_CANCEL_WINDOW_MS,
  Transaction,
  TransactionStatus,
  ViewName,
  canCancelTransaction,
} from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  transaction?: Transaction;
  onCancelTransaction: (id: string) => void;
  /** Ya hay una apelacion enviada para este movimiento */
  appealed: boolean;
};

type Row = { key: string; label: string; value: string; icon: IconComponent; valueColor?: string };

const formatUsd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatMxn = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

/** "12:34" a partir de milisegundos */
const formatClock = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const STATUS_KIND: Record<TransactionStatus, StatusKind> = {
  completed: "completed",
  pending: "inProgress",
  cancelled: "cancelled",
};

const STATUS_COLOR: Record<TransactionStatus, string> = {
  completed: tokens.successText,
  pending: tokens.warningText,
  cancelled: tokens.dangerText,
};

/**
 * Desglose de un movimiento, sea del tipo que sea. Las remesas en proceso
 * dentro de la ventana de 30 minutos se pueden cancelar desde aqui.
 *
 * Las superficies van en el color solido del menu desplegable
 * (`colors.sheetSurface`), no en vidrio: asi se aprobo.
 */
export default function TransactionDetailView({
  t,
  setView,
  transaction,
  onCancelTransaction,
  appealed,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  /**
   * Reloj para el tiempo restante de cancelacion. Solo corre cuando hay una
   * remesa con hora de creacion; al vencer, `canCancelTransaction` pasa a
   * `false` en el siguiente tic y el boton desaparece solo.
   */
  const [now, setNow] = useState(() => Date.now());
  const hasWindow =
    transaction?.type === "remittance" &&
    transaction.status === "pending" &&
    transaction.createdAt !== undefined;

  useEffect(() => {
    if (!hasWindow) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hasWindow]);

  const goBack = () => setView("transactions");

  if (!transaction) {
    return (
      <ScreenLayout
        showBack
        onBack={goBack}
        backTestID="transactionDetail-backButton"
        backAccessibilityLabel={t.back}
      >
        <ScreenHeader icon={Receipt} title={t.transactionDetail} style={styles.header} />
      </ScreenLayout>
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
  const cancellable = canCancelTransaction(transaction, now);
  const cancelled = transaction.status === "cancelled";

  const remainingMs =
    hasWindow && transaction.createdAt !== undefined
      ? REMITTANCE_CANCEL_WINDOW_MS - (now - transaction.createdAt)
      : 0;

  const rows: Row[] = [
    { key: "type", label: t.transactionType, value: typeLabel, icon: Tag },
    {
      key: "provider",
      label: t.operatedBy,
      value: PROVIDER_NAMES[transaction.provider],
      icon: Building2,
    },
    { key: "concept", label: t.concept, value: label, icon: FileText },
  ];

  if (isRemittance) {
    rows.push(
      {
        key: "amountUsd",
        label: t.amountToSendUsd,
        value: formatUsd(transaction.amountUsd),
        icon: CircleDollarSign,
      },
      {
        key: "exchangeRate",
        label: t.exchangeRate,
        value: `1 USD = ${(transaction.exchangeRate ?? 0).toFixed(2)} MXN`,
        icon: ArrowLeftRight,
      },
      {
        key: "amountMxn",
        label: t.amountToReceiveMxn,
        value: formatMxn(transaction.mxnAmount ?? 0),
        icon: Landmark,
      },
      {
        key: "beneficiary",
        label: t.beneficiary,
        value: transaction.beneficiary ?? t.notAvailable,
        icon: User,
      },
    );
  } else {
    rows.push({ key: "amount", label: t.amountLabel, value: transaction.amount, icon: CircleDollarSign });
  }

  rows.push(
    { key: "date", label: t.dateLabel, value: transaction.date, icon: CalendarDays },
    {
      key: "status",
      label: t.status,
      value: statusLabel,
      icon: Info,
      valueColor: STATUS_COLOR[transaction.status],
    },
    { key: "reference", label: t.referenceLabel, value: transaction.reference, icon: Hash },
  );

  const handleConfirmCancel = () => {
    onCancelTransaction(transaction.id);
    setConfirming(false);
  };

  return (
    <ScreenLayout
      showBack
      onBack={goBack}
      backTestID="transactionDetail-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={cancelled ? CircleX : Receipt}
        iconVariant={cancelled ? "ring" : "filled"}
        iconTone={cancelled ? "danger" : "default"}
        title={t.transactionDetail}
        subtitle={isRemittance && !cancelled ? t.remittanceCancelationInfo : undefined}
        style={styles.header}
      />

      <View style={[styles.card, styles.hero]}>
        <Badge label={typeLabel} variant={transaction.type} />
        <Text
          testID="transactionDetail-amount"
          style={[textStyles.amountLarge, cancelled && styles.heroAmountCancelled]}
        >
          {transaction.amount}
        </Text>
        <StatusBadge status={STATUS_KIND[transaction.status]} label={statusLabel} />
      </View>

      {cancellable && hasWindow && !confirming ? (
        <View testID="transactionDetail.countdown" style={[styles.card, styles.countdown]}>
          <ProgressBar progress={remainingMs / REMITTANCE_CANCEL_WINDOW_MS} />
          <View style={styles.countdownRow}>
            <View style={styles.countdownLabel}>
              <Clock size={16} color={tokens.textSecondary} strokeWidth={1.75} />
              <Text style={textStyles.caption}>{t.timeRemaining}</Text>
            </View>
            <Text testID="transactionDetail.countdownValue" style={textStyles.rowTitle}>
              {formatClock(remainingMs)}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.rows}>
        {rows.map((row) => (
          <DetailRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            value={row.value}
            valueColor={row.valueColor}
            surfaceColor={colors.sheetSurface}
            valueTestID={`transactionDetail-${row.key}`}
          />
        ))}
      </View>

      {cancelled ? (
        <InfoCard
          testID="transactionDetail-cancelledBanner"
          icon={CircleX}
          tone="danger"
          text={t.operationCancelled}
          style={styles.notice}
        />
      ) : null}

      {isRemittance && !cancelled && !cancellable ? (
        <InfoCard
          testID="transactionDetail-notCancellable"
          text={t.cancelNotAvailable}
          style={styles.notice}
        />
      ) : null}

      {cancellable && !confirming ? (
        <SecondaryButton
          testID="transactionDetail-cancelButton"
          title={t.cancelOperation}
          tone="danger"
          onPress={() => setConfirming(true)}
          style={styles.action}
        />
      ) : null}

      {!confirming && appealed ? (
        <InfoCard
          testID="transactionDetail-appealedBanner"
          icon={Clock}
          tone="warning"
          text={t.appealInReview}
          style={styles.notice}
        />
      ) : null}

      {!confirming && !appealed ? (
        <SecondaryButton
          testID="transactionDetail-appealButton"
          title={t.appealOperation}
          onPress={() => setView("appeal")}
          style={cancellable ? styles.actionNext : styles.action}
        />
      ) : null}

      {cancellable && confirming ? (
        <View testID="transactionDetail-confirmCard" style={[styles.card, styles.confirm]}>
          <HeroIcon icon={AlertCircle} variant="ring" tone="danger" size={64} />
          <Text style={[textStyles.sectionTitle, styles.centerText]}>{t.cancelConfirmTitle}</Text>
          <Text style={[textStyles.subtitle, styles.confirmMessage]}>{t.cancelConfirmMessage}</Text>

          <PrimaryButton
            testID="transactionDetail-confirmCancelButton"
            title={t.cancelConfirmYes}
            tone="danger"
            onPress={handleConfirmCancel}
          />
          <SecondaryButton
            testID="transactionDetail-keepButton"
            title={t.cancelConfirmNo}
            onPress={() => setConfirming(false)}
          />
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  /** Superficie opaca, la misma del menu desplegable, para que el fondo no se transparente */
  card: {
    backgroundColor: colors.sheetSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    borderRadius: metrics.radius.card,
    padding: spacing.lg,
  },
  hero: {
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heroAmountCancelled: {
    textDecorationLine: "line-through",
    color: tokens.textDisabled,
  },
  countdown: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countdownLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rows: {
    gap: metrics.rowGap,
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
    alignItems: "stretch",
  },
  centerText: {
    textAlign: "center",
    marginTop: spacing.sm,
  },
  confirmMessage: {
    marginBottom: spacing.sm,
  },
});
