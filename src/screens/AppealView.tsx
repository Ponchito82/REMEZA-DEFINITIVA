import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock, MessageSquareWarning } from "lucide-react-native";

import {
  InfoCard,
  PrimaryButton,
  ScreenHeader,
  ScreenLayout,
  SelectField,
  StatusBadge,
} from "../components/ui";
import { colors, tokens } from "../theme/colors";
import { textStyles } from "../theme/typography";
import { metrics } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { PROVIDER_NAMES, Transaction, ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;
  transaction?: Transaction;
  /** La apelacion ya enviada para este movimiento, si existe */
  submittedReason?: string;
  onSubmitAppeal: (id: string, reason: string) => void;
};

const REASONS = ["unrecognized", "duplicate", "amount", "other"] as const;

/** Pantalla propia para apelar un movimiento. */
export default function AppealView({
  t,
  setView,
  transaction,
  submittedReason,
  onSubmitAppeal,
}: Props) {
  const [reason, setReason] = useState("");

  const goBack = () => setView("transactionDetail");
  const submitted = !!submittedReason;

  const label = transaction?.labelKey ? t[transaction.labelKey] : transaction?.label;

  const options = REASONS.map((key) => ({
    label: t[`appealReason_${key}`],
    value: key,
  }));

  return (
    <ScreenLayout
      showBack
      onBack={goBack}
      backTestID="appeal-backButton"
      backAccessibilityLabel={t.back}
    >
      <ScreenHeader
        icon={MessageSquareWarning}
        title={t.appealTitle}
        subtitle={t.appealSubtitle}
        style={styles.header}
      />

      {transaction ? (
        <View style={styles.summary}>
          <Text testID="appeal-concept" style={textStyles.rowTitle}>
            {label}
          </Text>
          <Text style={textStyles.caption}>
            {`${PROVIDER_NAMES[transaction.provider]} · ${transaction.reference}`}
          </Text>
          <Text style={[textStyles.amountLarge, styles.amount]}>{transaction.amount}</Text>
          {submitted ? <StatusBadge status="inReview" label={t.appealInReview} /> : null}
        </View>
      ) : null}

      {submitted ? (
        <InfoCard
          testID="appeal-submittedBanner"
          icon={Clock}
          tone="warning"
          text={t.appealSubmitted}
        />
      ) : (
        <View style={styles.form}>
          <SelectField
            testID="appeal-reasonSelect"
            label={t.appealReasonLabel}
            placeholder={t.appealReasonPlaceholder}
            leftIcon={MessageSquareWarning}
            options={options}
            value={reason}
            onSelect={setReason}
          />

          <PrimaryButton
            testID="appeal-submitButton"
            title={t.appealSubmit}
            disabled={!reason || !transaction}
            onPress={() => transaction && onSubmitAppeal(transaction.id, reason)}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  /** Superficie opaca, la misma del menu desplegable */
  summary: {
    backgroundColor: colors.sheetSurface,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    borderRadius: metrics.radius.card,
    padding: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  amount: {
    marginVertical: spacing.sm,
  },
  form: {
    gap: spacing.xl,
  },
});
