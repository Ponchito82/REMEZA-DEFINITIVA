import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { buildStatementLines } from "../../utils/creditStatements";
import type { CreditStatement } from "../../utils/creditStatements";
import type { Language } from "../../types/app";

/** Ancho en dp del documento; la imagen descargada sale a este ancho. */
export const STATEMENT_DOC_WIDTH = 420;

const MONTHS: Record<Language, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** "04 Sep" */
export const shortDate = (ms: number, language: Language) => {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[language][d.getMonth()]}`;
};

const longDate = (ms: number, language: Language) => {
  const d = new Date(ms);
  return `${d.getDate()} ${MONTHS[language][d.getMonth()]} ${d.getFullYear()}`;
};

type Props = {
  t: any;
  language: Language;
  holderName: string;
  creditLimitUsd: number;
  statement: CreditStatement;
};

/**
 * Estado de cuenta como documento descargable. Se dibuja a un ancho fijo para que
 * la imagen salga igual en cualquier telefono.
 */
const CreditStatementDocument = forwardRef<View, Props>(function CreditStatementDocument(
  { t, language, holderName, creditLimitUsd, statement },
  ref,
) {
  const lines = buildStatementLines(statement);
  const dueAt = statement.cutoffAt + 10 * DAY_MS;
  const available = Math.max(0, creditLimitUsd - statement.closingUsd);

  const summary: [string, string][] = [
    [`+ ${t.creditStmtOpening}`, money(statement.openingUsd)],
    [`- ${t.creditStmtPayments}`, money(statement.paymentsUsd)],
    [`+ ${t.creditStmtPurchases}`, money(statement.purchasesUsd)],
    [`+ ${t.creditStmtInterest}`, money(0)],
    [`+ ${t.creditStmtFees}`, money(statement.feesUsd)],
  ];

  return (
    <View ref={ref} collapsable={false} style={styles.doc}>
      <View style={styles.top}>
        <View>
          <Text style={styles.brand}>REMEZA</Text>
          <Text style={styles.docTitle}>{t.creditStmtDocTitle}</Text>
        </View>
        <View style={styles.holderBox}>
          <Text style={styles.holder}>{holderName}</Text>
          <Text style={styles.muted}>**** 1234</Text>
        </View>
      </View>

      <View style={styles.twoCols}>
        <View style={styles.colLeft}>
          <Text style={styles.label}>{t.creditStmtPeriod}</Text>
          <Text style={styles.value}>
            {longDate(statement.periodStartAt, language)} - {longDate(statement.cutoffAt, language)}
          </Text>
          <Text style={[styles.label, styles.gap]}>{t.creditStmtCutoff}</Text>
          <Text style={styles.value}>{longDate(statement.cutoffAt, language)}</Text>
          <Text style={[styles.label, styles.gap]}>{t.creditStmtDueDate}</Text>
          <Text style={styles.value}>{longDate(dueAt, language)}</Text>
          <View style={styles.minBox}>
            <View style={styles.flex}>
              <Text style={styles.minTitle}>{t.creditStmtMinPayment}</Text>
              <Text style={styles.minNote}>{t.creditStmtMinNote}</Text>
            </View>
            <Text style={styles.minValue}>{money(statement.minPaymentUsd)}</Text>
          </View>
        </View>
        <View style={styles.colRight}>
          <View style={styles.kv}>
            <Text style={styles.small}>{t.creditStmtLimit}</Text>
            <Text style={styles.smallValue}>{money(creditLimitUsd)}</Text>
          </View>
          <View style={styles.kv}>
            <Text style={styles.small}>{t.creditStmtAvailable}</Text>
            <Text style={styles.smallValue}>{money(available)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.kv}>
            <Text style={styles.small}>{t.creditStmtRateOrdinary}</Text>
            <Text style={styles.smallValue}>0 %</Text>
          </View>
          <View style={styles.kv}>
            <Text style={styles.small}>{t.creditStmtRateLate}</Text>
            <Text style={styles.smallValue}>0 %</Text>
          </View>
        </View>
      </View>

      <Text style={styles.section}>{t.creditStmtSummary}</Text>
      {summary.map(([k, v]) => (
        <View key={k} style={styles.sumRow}>
          <Text style={styles.sumLabel}>{k}</Text>
          <Text style={styles.sumValue}>{v}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.sumRow}>
        <Text style={styles.sumTotal}>{t.creditStmtClosing}</Text>
        <Text style={styles.sumTotal}>{money(statement.closingUsd)}</Text>
      </View>

      <Text style={styles.section}>{t.creditStmtMovements}</Text>
      <StatementTable t={t} language={language} lines={lines} />
    </View>
  );
});

export function StatementTable({
  t,
  language,
  lines,
}: {
  t: any;
  language: Language;
  lines: ReturnType<typeof buildStatementLines>;
}) {
  return (
    <View>
      <View style={table.head}>
        <Text style={[table.headText, table.cDate]}>{t.creditStmtDate}</Text>
        <Text style={[table.headText, table.cCard]}>{t.creditStmtCard}</Text>
        <Text style={[table.headText, table.cName]}>{t.creditStmtMerchant}</Text>
        <Text style={[table.headText, table.cAmount]}>{t.creditStmtCharge}</Text>
        <Text style={[table.headText, table.cAmount]}>{t.creditStmtCredit}</Text>
      </View>
      {lines.map((line, i) => (
        <View key={line.id} style={[table.row, i % 2 === 0 && table.rowAlt]}>
          <Text style={[table.cell, table.cDate]}>{shortDate(line.at, language)}</Text>
          <Text style={[table.cell, table.cCard]}>*1234</Text>
          <Text style={[table.cell, table.cName]}>{t[line.nameKey]}</Text>
          <Text style={[table.cell, table.cAmount]}>
            {line.kind !== "payment" ? money(line.amountUsd) : ""}
          </Text>
          <Text style={[table.cell, table.cAmount]}>
            {line.kind === "payment" ? `-${money(line.amountUsd)}` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  doc: {
    width: STATEMENT_DOC_WIDTH,
    padding: 20,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brand: { fontFamily: fontFamily.bold, fontSize: 26, letterSpacing: 3, color: "#FFFFFF" },
  docTitle: { fontFamily: fontFamily.semibold, fontSize: 15, color: colors.text.primary, marginTop: 6 },
  holderBox: { alignItems: "flex-end" },
  holder: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.text.primary },
  muted: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.primaryLight, marginTop: 2 },
  twoCols: { flexDirection: "row", gap: 12, marginTop: 22 },
  colLeft: { flex: 1 },
  colRight: {
    flex: 1,
    padding: 10,
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.sheetSurface,
  },
  label: { fontFamily: fontFamily.semibold, fontSize: 11, color: colors.primaryLight },
  value: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.text.primary, marginTop: 2 },
  gap: { marginTop: 10 },
  minBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  minTitle: { fontFamily: fontFamily.bold, fontSize: 12, color: "#FFFFFF" },
  minNote: { fontFamily: fontFamily.regular, fontSize: 10, color: "#FFFFFF" },
  minValue: { fontFamily: fontFamily.bold, fontSize: 14, color: "#FFFFFF" },
  kv: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  small: { flex: 1, fontFamily: fontFamily.regular, fontSize: 10, color: colors.text.primary },
  smallValue: { fontFamily: fontFamily.semibold, fontSize: 10, color: colors.text.primary },
  divider: { height: 1, marginVertical: 8, backgroundColor: colors.borderSubtle },
  section: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.text.primary, marginTop: 22, marginBottom: 8 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  sumLabel: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.text.primary },
  sumValue: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.text.primary },
  sumTotal: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.text.primary },
});

export const table = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  headText: { fontFamily: fontFamily.bold, fontSize: 11, color: "#FFFFFF" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 9, paddingHorizontal: 8 },
  rowAlt: { backgroundColor: colors.surfaceStrong },
  cell: { fontFamily: fontFamily.regular, fontSize: 11, color: colors.text.primary },
  cDate: { width: 46 },
  cCard: { width: 46 },
  cName: { flex: 1, paddingRight: 4 },
  cAmount: { width: 64, textAlign: "right" },
});

export default CreditStatementDocument;
