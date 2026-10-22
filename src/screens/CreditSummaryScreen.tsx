import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { CalendarDays, ChevronRight, FileText, Info, Settings, Wallet } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import CreditDepositNoticeDialog from "../components/ui/CreditDepositNoticeDialog";
import { nextCreditCutoff } from "../utils/creditSimulation";
import { CreditCardArt, CreditFlowHeader, CreditMovementRow } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import type { Language } from "../types/app";
import type { CreditMovement } from "../utils/creditSimulation";

type Props = {
  t: any;
  language: Language;
  /** Nombre completo con el que se registro; solo se usa el primer nombre. */
  holderName: string;
  /** Limite de credito en dolares (el monto de la garantia). */
  creditLimitUsd: number;
  /** Saldo utilizado (lo que se debe). */
  usedUsd: number;
  /** Saldo a favor acumulado por pagos que exceden lo utilizado. */
  creditBalanceUsd: number;
  /** Fecha limite de pago, en ms. */
  dueAt: number;
  /** Fecha en que se deposito la garantia, en ms. */
  depositedAt: number | null;
  onPay: () => void;
  movements: CreditMovement[];
  onWithdrawGuarantee: () => void;
  onOpenMovements: () => void;
  onOpenStatements: () => void;
  setIsMenuOpen: (value: boolean) => void;
  /** Regresa a la pantalla principal (donde esta la tarjeta de debito). */
  onBack: () => void;
};

const MONTHS: Record<Language, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

export function formatDueDate(dueAt: number, language: Language): string {
  const due = new Date(dueAt);
  return `${due.getDate()} ${MONTHS[language][due.getMonth()]} ${due.getFullYear()}`;
}

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function CreditSummaryScreen({
  t,
  language,
  holderName,
  creditLimitUsd,
  usedUsd,
  creditBalanceUsd,
  dueAt,
  depositedAt,
  onPay,
  movements,
  onOpenMovements,
  onOpenStatements,
  onWithdrawGuarantee,
  setIsMenuOpen,
  onBack,
}: Props) {
  const firstName = holderName.trim().split(/\s+/)[0] ?? "";
  const used = usedUsd;
  // El saldo a favor se acumula al limite: limite total = base + saldo a favor.
  const totalLimit = creditLimitUsd + creditBalanceUsd;
  const available = totalLimit - used;
  const usedPct = totalLimit > 0 ? Math.min(100, (used / totalLimit) * 100) : 0;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showGuarantee, setShowGuarantee] = useState(false);
  const [showLimitInfo, setShowLimitInfo] = useState(false);
  const hasDebt = used > 0;
  const dueDate = formatDueDate(dueAt, language);
  const cutoffDate = formatDueDate(nextCreditCutoff(), language);

  // La garantia solo se puede retirar tras 12 meses del deposito.
  const unlockDate = depositedAt === null ? null : new Date(depositedAt);
  unlockDate?.setMonth(unlockDate.getMonth() + 12);
  const canWithdraw = unlockDate !== null && Date.now() >= unlockDate.getTime();

  const actions = [
    { id: "pay", icon: Wallet, label: t.creditActionPay },
    { id: "movements", icon: FileText, label: t.creditActionMovements },
    { id: "statements", icon: CalendarDays, label: t.creditActionStatements },
    ...(canWithdraw ? [{ id: "guarantee", icon: Settings, label: t.creditActionGuarantee }] : []),
  ];

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditSummary"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
      />

      <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        <Text testID="creditSummary-greeting" style={localStyles.greeting}>
          {t.greetingPrefix} <Text style={localStyles.accent}>{firstName}</Text>
        </Text>
        <Text style={localStyles.subtitle}>{t.creditSummarySubtitle}</Text>

        <CreditCardArt t={t} holderName={holderName} label={t.creditGuaranteedLabel} last4="1234" />

        <View style={localStyles.limitCard}>
          <View style={localStyles.limitTop}>
            <View>
              <View style={localStyles.limitLabelRow}>
                <Text style={localStyles.limitLabel}>{t.creditLimitLabel}</Text>
                <Pressable
                  testID="creditSummary-limitInfo"
                  accessibilityRole="button"
                  onPress={() => setShowLimitInfo(true)}
                  hitSlop={10}
                >
                  <Info size={14} color={colors.text.secondary} strokeWidth={2} />
                </Pressable>
              </View>
              <Pressable
                testID="creditSummary-limitBreakdown"
                accessibilityRole="button"
                disabled={creditBalanceUsd <= 0}
                onPress={() => setShowBreakdown(true)}
              >
                <Text testID="creditSummary-limit" style={localStyles.limitValue}>
                  {money(totalLimit)}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={localStyles.bar}>
            <View style={[localStyles.barUsed, { width: `${usedPct}%` }]} />
            <View style={localStyles.barAvailable} />
          </View>

          <View style={localStyles.legend}>
            <View style={localStyles.legendItem}>
              <View style={[localStyles.dot, localStyles.dotUsed]} />
              <Text style={localStyles.legendText}>
                {t.creditUsedLabel} <Text style={localStyles.legendValue}>{money(used)}</Text>
              </Text>
            </View>
            <View style={localStyles.legendItem}>
              <View style={[localStyles.dot, localStyles.dotAvailable]} />
              <Text style={localStyles.legendText}>
                {t.creditAvailableLabel} <Text style={localStyles.legendValue}>{money(available)}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={localStyles.actions}>
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.id}
                testID={`creditSummary-action-${item.id}`}
                accessibilityRole="button"
                onPress={
                  item.id === "pay"
                    ? onPay
                    : item.id === "movements"
                      ? onOpenMovements
                      : item.id === "statements"
                        ? onOpenStatements
                        : () => setShowGuarantee(true)
                }
                style={({ pressed }) => [localStyles.action, pressed && localStyles.pressed]}
              >
                <View style={localStyles.actionIcon}>
                  <Icon size={20} color={colors.text.primary} strokeWidth={2} />
                </View>
                <Text style={localStyles.actionText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          testID="creditSummary-nextPayment"
          accessibilityRole="button"
          style={({ pressed }) => [localStyles.payment, pressed && localStyles.pressed]}
        >
          <View style={localStyles.actionIcon}>
            <CalendarDays size={20} color={colors.text.primary} strokeWidth={2} />
          </View>
          <View style={localStyles.paymentBody}>
            <Text style={localStyles.paymentTitle}>{t.creditNextPayment}</Text>
            <View style={localStyles.paymentCols}>
              <View>
                <Text style={localStyles.paymentLabel}>{t.creditCutoffDate}</Text>
                <Text style={localStyles.paymentValue}>{cutoffDate}</Text>
              </View>
              <View>
                <Text style={localStyles.paymentLabel}>{t.creditDueDate}</Text>
                <Text style={localStyles.paymentValue}>{dueDate}</Text>
              </View>
              <View>
                <Text style={localStyles.paymentLabel}>{t.creditAmountToPay}</Text>
                <Text style={localStyles.paymentValue}>{money(used)}</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color={colors.primaryLight} strokeWidth={2.2} />
        </Pressable>

        <View style={localStyles.recentHeader}>
          <Text style={localStyles.recentTitle}>
            {t.creditRecentTitle} <Text style={localStyles.accent}>{t.creditRecentAccent}</Text>
          </Text>
          <Pressable
            testID="creditSummary-seeAll"
            accessibilityRole="button"
            onPress={onOpenMovements}
            style={localStyles.seeAllRow}
          >
            <Text style={localStyles.seeAll}>{t.seeAll}</Text>
            <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>
        </View>

        {movements.length > 0 ? (
          <View style={localStyles.recentList}>
            {movements.slice(0, 3).map((movement) => (
              <CreditMovementRow
                key={movement.id}
                testID="creditSummary-movement"
                t={t}
                language={language}
                movement={movement}
              />
            ))}
          </View>
        ) : (
          <View style={localStyles.empty}>
            <View style={localStyles.emptyIcon}>
              <FileText size={22} color={colors.text.secondary} strokeWidth={2} />
            </View>
            <Text style={localStyles.emptyTitle}>{t.creditEmptyTitle}</Text>
            <Text style={localStyles.emptyDesc}>{t.creditEmptyDesc}</Text>
          </View>
        )}
      </ScrollView>

      {showBreakdown ? (
        <CreditDepositNoticeDialog
          testID="creditLimitBreakdown"
          title={t.creditLimitLabel}
          body={`${t.creditBaseLabel}: ${money(creditLimitUsd)}\n${t.creditBalanceLabel}: ${money(creditBalanceUsd)}\n${t.creditTotalLabel}: ${money(totalLimit)}`}
          acceptLabel={t.creditGuaranteeOk}
          onCancel={() => setShowBreakdown(false)}
          onAccept={() => setShowBreakdown(false)}
        />
      ) : null}

      {showLimitInfo ? (
        <CreditDepositNoticeDialog
          testID="creditLimitInfo"
          title={t.creditLimitInfoTitle}
          body={t.creditLimitInfoBody}
          acceptLabel={t.creditGuaranteeOk}
          onCancel={() => setShowLimitInfo(false)}
          onAccept={() => setShowLimitInfo(false)}
        />
      ) : null}

      {showGuarantee ? (
        <CreditDepositNoticeDialog
          testID="creditGuarantee"
          title={t.creditGuaranteeTitle}
          body={(hasDebt ? t.creditGuaranteeDebtBody : t.creditGuaranteeBody).replace(
            "{amount}",
            money(hasDebt ? used : creditLimitUsd),
          )}
          acceptLabel={hasDebt ? t.creditGuaranteeOk : t.creditGuaranteeConfirm}
          cancelLabel={hasDebt ? undefined : t.creditDepositNoticeCancel}
          onCancel={() => setShowGuarantee(false)}
          onAccept={() => {
            setShowGuarantee(false);
            if (!hasDebt) onWithdrawGuarantee();
          }}
        />
      ) : null}
    </View>
  );
}

const panel = {
  borderRadius: 18,
  borderWidth: 1,
  borderColor: colors.borderSubtle,
  backgroundColor: colors.surface,
} as const;

const localStyles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  pressed: { opacity: 0.7 },
  accent: { color: "#FFFFFF" },
  greeting: {
    ...typography.h1,
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  limitCard: {
    ...panel,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  limitTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  limitLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  limitLabel: {
    ...typography.caption,
  },
  limitValue: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.text.primary,
    marginTop: 2,
  },
  availableBlock: {
    alignItems: "flex-end",
  },
  availableLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.success,
  },
  availableValue: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.success,
    marginTop: 2,
  },
  bar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: spacing.md,
    backgroundColor: colors.primary,
  },
  barUsed: {
    backgroundColor: "#F97316",
  },
  barAvailable: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotUsed: { backgroundColor: "#F97316" },
  dotAvailable: { backgroundColor: colors.primary },
  legendText: {
    ...typography.caption,
    fontSize: 15,
    color: colors.text.secondary,
  },
  legendValue: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  action: {
    ...panel,
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  actionText: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    color: colors.text.primary,
  },
  payment: {
    ...panel,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  paymentBody: {
    flex: 1,
    gap: spacing.xs,
  },
  paymentTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text.primary,
  },
  paymentCols: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: spacing.sm,
    gap: spacing.xxl,
  },
  paymentLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  paymentValue: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text.primary,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  recentTitle: {
    ...typography.h2,
    fontSize: 19,
    lineHeight: 24,
  },
  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAll: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    color: "#FFFFFF",
  },
  recentList: {
    gap: spacing.sm,
  },
  empty: {
    ...panel,
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.xs,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.text.primary,
  },
  emptyDesc: {
    ...typography.caption,
    textAlign: "center",
  },
});
