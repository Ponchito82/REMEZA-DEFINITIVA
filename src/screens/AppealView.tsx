import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { MessageSquareWarning } from "lucide-react-native";

import {
  Button,
  CloseButton,
  GlassBanner,
  GlassCard,
  ScreenHeader,
  SelectField,
} from "../components/ui";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";
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
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <CloseButton testID="appeal-backButton" onPress={goBack} />

      <ScreenHeader
        title={t.appealTitle}
        subtitle={t.appealSubtitle}
        style={styles.header}
      />

      {transaction ? (
        <GlassCard size="lg" style={styles.summary}>
          <Text testID="appeal-concept" style={typography.bodyStrong}>
            {label}
          </Text>
          <Text style={typography.caption}>
            {`${PROVIDER_NAMES[transaction.provider]} · ${transaction.reference}`}
          </Text>
          <Text style={[typography.amount, styles.amount]}>{transaction.amount}</Text>
        </GlassCard>
      ) : null}

      {submitted ? (
        <GlassBanner
          testID="appeal-submittedBanner"
          tone="info"
          message={t.appealSubmitted}
          style={styles.notice}
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

          <Button
            testID="appeal-submitButton"
            title={t.appealSubmit}
            rightAdornment="none"
            disabled={!reason || !transaction}
            onPress={() => transaction && onSubmitAppeal(transaction.id, reason)}
          />
        </View>
      )}
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
  /** Superficie opaca, la misma del menu desplegable */
  summary: {
    backgroundColor: colors.sheetSurface,
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  amount: {
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.xl,
  },
  notice: {
    marginTop: spacing.sm,
  },
});
