import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { CalendarCheck, Check, X } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { spacing, screenPadding } from "../theme/spacing";
import CreditDepositNoticeDialog from "../components/ui/CreditDepositNoticeDialog";
import { CreditFlowHeader } from "../components/remeza";
import { formatDueDate } from "./CreditSummaryScreen";
import type { Language } from "../types/app";

type Props = {
  t: any;
  language: Language;
  /** Limite base (garantia) que se mantiene al ampliar. */
  creditLimitUsd: number;
  /** Saldo utilizado: para ampliar debe estar en $0. */
  usedUsd: number;
  /** Fecha en que se inicio el periodo, en ms. */
  depositedAt: number | null;
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
  /** Lleva a pagar el saldo pendiente. */
  onPay: () => void;
  /** Inicia un nuevo periodo de 12 meses. */
  onExtend: () => void;
};

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

/** Pantalla de fin del periodo de historial: permite ampliarlo si no hay deudas. */
export default function CreditExtensionScreen({
  t,
  language,
  creditLimitUsd,
  usedUsd,
  depositedAt,
  setIsMenuOpen,
  onBack,
  onPay,
  onExtend,
}: Props) {
  const [showDone, setShowDone] = useState(false);
  const hasDebt = usedUsd > 0;

  const start = depositedAt === null ? null : new Date(depositedAt);
  const end = start === null ? null : new Date(start);
  end?.setMonth(end.getMonth() + 12);

  const requirements = [
    { id: "period", ok: true, label: t.creditExtPeriodDone },
    {
      id: "debt",
      ok: !hasDebt,
      label: hasDebt
        ? t.creditExtDebtPending.replace("{amount}", money(usedUsd))
        : t.creditExtNoDebt,
    },
  ];

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditExtension"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
      />

      <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        <View style={localStyles.hero}>
          <View style={localStyles.heroIcon}>
            <CalendarCheck size={34} color={colors.text.primary} strokeWidth={2} />
          </View>
          <Text testID="creditExtension-title" style={localStyles.title}>
            {t.creditExtTitle}
          </Text>
          <Text style={localStyles.subtitle}>{t.creditExtSubtitle}</Text>
        </View>

        <View style={localStyles.panel}>
          <View style={localStyles.periodRow}>
            <View>
              <Text style={localStyles.label}>{t.creditExtStart}</Text>
              <Text style={localStyles.value}>
                {start ? formatDueDate(start.getTime(), language) : "—"}
              </Text>
            </View>
            <View style={localStyles.alignEnd}>
              <Text style={localStyles.label}>{t.creditExtEnd}</Text>
              <Text style={localStyles.value}>
                {end ? formatDueDate(end.getTime(), language) : "—"}
              </Text>
            </View>
          </View>
          <View style={localStyles.bar}>
            <View style={localStyles.barFill} />
          </View>
          <Text style={localStyles.barCaption}>{t.creditExtDuration}</Text>
        </View>

        <View style={localStyles.panel}>
          <Text style={localStyles.panelTitle}>{t.creditExtRequirements}</Text>
          {requirements.map((item) => (
            <View key={item.id} style={localStyles.reqRow}>
              <View style={[localStyles.reqIcon, item.ok ? localStyles.reqOk : localStyles.reqFail]}>
                {item.ok ? (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <X size={14} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
              <Text style={localStyles.reqText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={localStyles.note}>
          {t.creditExtNote.replace("{amount}", money(creditLimitUsd))}
        </Text>

        <Pressable
          testID="creditExtension-extendButton"
          accessibilityRole="button"
          accessibilityState={{ disabled: hasDebt }}
          disabled={hasDebt}
          onPress={() => setShowDone(true)}
          style={({ pressed }) => [
            localStyles.primary,
            hasDebt && localStyles.disabled,
            pressed && localStyles.pressed,
          ]}
        >
          <LinearGradient
            colors={primaryGradient.colors}
            locations={primaryGradient.locations}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={StyleSheet.absoluteFill}
          />
          <Text style={localStyles.primaryText}>{t.creditExtCta}</Text>
        </Pressable>

        {hasDebt ? (
          <Pressable
            testID="creditExtension-payButton"
            accessibilityRole="button"
            onPress={onPay}
            style={({ pressed }) => [localStyles.secondary, pressed && localStyles.pressed]}
          >
            <Text style={localStyles.secondaryText}>{t.creditExtPayFirst}</Text>
          </Pressable>
        ) : null}

        <Pressable
          testID="creditExtension-notNow"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [localStyles.secondary, pressed && localStyles.pressed]}
        >
          <Text style={localStyles.secondaryText}>{t.creditExtNotNow}</Text>
        </Pressable>
      </ScrollView>

      {showDone ? (
        <CreditDepositNoticeDialog
          testID="creditExtensionDone"
          title={t.creditExtDoneTitle}
          body={t.creditExtDoneBody}
          acceptLabel={t.creditGuaranteeOk}
          onCancel={() => {
            setShowDone(false);
            onExtend();
          }}
          onAccept={() => {
            setShowDone(false);
            onExtend();
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
  disabled: { opacity: 0.4 },
  hero: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.45)",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  panel: {
    ...panel,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alignEnd: { alignItems: "flex-end" },
  label: {
    ...typography.caption,
  },
  value: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text.primary,
    marginTop: 2,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: spacing.md,
    backgroundColor: colors.primary,
  },
  barFill: {
    flex: 1,
    backgroundColor: colors.success,
  },
  barCaption: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  panelTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  reqIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reqOk: { backgroundColor: colors.success },
  reqFail: { backgroundColor: "#F97316" },
  reqText: {
    ...typography.body,
    flex: 1,
    color: colors.text.primary,
  },
  note: {
    ...typography.body,
    textAlign: "center",
    marginVertical: spacing.lg,
  },
  primary: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  primaryText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  secondary: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  secondaryText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.primaryLight,
  },
});
