import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { StatusScreen } from "../components/ui";
import CreditDepositNoticeDialog from "../components/ui/CreditDepositNoticeDialog";
import LinearGradient from "react-native-linear-gradient";
import { CalendarDays, ChevronRight, Info, LoaderCircle, Wallet } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { CreditCardArt, CreditFlowHeader } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import { formatDueDate } from "./CreditSummaryScreen";
import { nextCreditCutoff } from "../utils/creditSimulation";
import { authenticateWithBiometrics, getBiometryKind } from "../services/biometrics";
import { isBiometricsEnabled } from "../services/securitySettings";
import { bioText } from "./security/biometryKind";
import type { Language } from "../types/app";

/** Duracion de la pantalla de procesando antes del comprobante. */
const PROCESSING_MS = 2200;
const DAY_MS = 24 * 60 * 60 * 1000;

type Props = {
  t: any;
  holderName?: string;
  language: Language;
  creditLimitUsd: number;
  /** Saldo utilizado (lo que se debe). */
  usedUsd: number;
  /** Fecha limite de pago, en ms. */
  dueAt: number;
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
  /** "Continuar": aplica el pago y abre la pantalla de pago realizado. */
  onContinue: (amountUsd: number) => void;
};

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function CreditPaymentScreen({
  t,
  holderName,
  language,
  creditLimitUsd,
  usedUsd,
  dueAt,
  setIsMenuOpen,
  onBack,
  onContinue,
}: Props) {
  // Se puede pagar el total o abonos parciales en cualquier momento antes del corte.
  const [mode, setMode] = useState<"total" | "other">("total");
  const [custom, setCustom] = useState("");
  const customAmount = Number(custom.replace(",", "."));
  const amount = mode === "total" ? usedUsd : customAmount;
  const valid = amount > 0;
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // Con biometria activada se exige huella / Face ID antes de registrar el pago.
  const confirmPayment = async () => {
    if (isBiometricsEnabled()) {
      const kind = await getBiometryKind();
      const result = await authenticateWithBiometrics(bioText(t, "creditPayBioPrompt", kind), t.cancel);
      if (!result.ok) return;
    }
    setProcessing(true);
    timer.current = setTimeout(() => onContinue(amount), PROCESSING_MS);
  };
  // Lo que excede el saldo utilizado queda como saldo a favor.
  const creditBalance = Math.max(0, Math.round((amount - usedUsd) * 100) / 100);
  const [infoOpen, setInfoOpen] = useState(false);

  const daysLeft = Math.max(0, Math.ceil((dueAt - Date.now()) / DAY_MS));

  if (processing) {
    return (
      <StatusScreen
        testID="creditPaymentProcessing"
        icon={LoaderCircle}
        iconSpinning
        iconSpinInner
        title={t.creditPayingTitle}
        subtitle={t.creditPayingSubtitle}
      />
    );
  }

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditPayment"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
        title={
          <>
            {t.creditPayTitle} <Text style={localStyles.accent}>{t.creditPayTitleAccent}</Text>
          </>
        }
      />

      <ScrollView
        contentContainerStyle={localStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={localStyles.subtitle}>{t.creditPaySubtitle}</Text>

        <CreditCardArt t={t} holderName={holderName} label={t.creditGuaranteedLabel} last4="1234" />

        <View style={localStyles.infoRow}>
          <View style={localStyles.iconBox}>
            <Wallet size={22} color={colors.text.primary} strokeWidth={2} />
          </View>
          <View>
            <Text style={localStyles.infoLabel}>{t.creditPayBalance}</Text>
            <Text testID="creditPayment-balance" style={localStyles.infoValue}>
              {money(usedUsd)}
            </Text>
            <Text style={localStyles.infoSub}>
              {t.creditPayOf} {money(creditLimitUsd)}
            </Text>
          </View>
        </View>

        <View style={localStyles.infoRow}>
          <View style={localStyles.iconBox}>
            <CalendarDays size={22} color={colors.text.primary} strokeWidth={2} />
          </View>
          <View>
            <Text style={localStyles.infoLabel}>{t.creditPayDueDate}</Text>
            <Text style={localStyles.infoValue}>{formatDueDate(dueAt, language)}</Text>
            <Text style={localStyles.infoSub}>
              {t.creditCutoffDate}: {formatDueDate(nextCreditCutoff(), language)}
            </Text>
            <Text style={localStyles.infoSub}>
              {t.creditPayIn} {daysLeft} {daysLeft === 1 ? t.creditPayDay : t.creditPayDays}
            </Text>
          </View>
        </View>

        <Text style={localStyles.question}>{t.creditPayQuestion}</Text>
        <View style={localStyles.options}>
          {(
            [
              { id: "total", label: t.creditPayTotal, value: money(usedUsd) },
              { id: "other", label: t.creditPayOther, value: "$" },
            ] as const
          ).map((opt) => (
            <Pressable
              key={opt.id}
              testID={`creditPayment-option-${opt.id}`}
              accessibilityRole="button"
              onPress={() => setMode(opt.id)}
              style={[localStyles.option, mode === opt.id && localStyles.optionActive]}
            >
              <Text style={localStyles.optionLabel}>{opt.label}</Text>
              <Text style={localStyles.optionValue}>{opt.value}</Text>
            </Pressable>
          ))}
        </View>

        {mode === "other" ? (
          <>
            <Text style={localStyles.inputLabel}>{t.creditPayEnterAmount}</Text>
            <View style={localStyles.inputBox}>
              <View style={localStyles.dollar}>
                <Text style={localStyles.dollarText}>$</Text>
              </View>
              <TextInput
                testID="creditPayment-amountInput"
                style={localStyles.input}
                value={custom}
                onChangeText={(v) => setCustom(v.replace(/[^0-9.,]/g, ""))}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.text.secondary}
              />
            </View>
          </>
        ) : null}

        {creditBalance > 0 ? (
          <View testID="creditPayment-favorBalance" style={localStyles.favor}>
            <View style={localStyles.noticeBody}>
              <Text style={localStyles.favorLabel}>{t.creditPayFavorLabel}</Text>
              <Text style={localStyles.favorValue}>
                ${creditBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </Text>
            </View>
            <Pressable
              testID="creditPayment-favorInfoButton"
              accessibilityRole="button"
              accessibilityLabel={t.creditPayFavorInfoTitle}
              hitSlop={10}
              onPress={() => setInfoOpen(true)}
              style={({ pressed }) => [localStyles.favorInfo, pressed && localStyles.pressed]}
            >
              <Info size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        ) : null}

        <View style={localStyles.notice}>
          <View style={localStyles.noticeBody}>
            <Text style={localStyles.noticeTitle}>{t.creditPayNoticeTitle}</Text>
            <Text style={localStyles.noticeDesc}>{t.creditPayNoticeDesc}</Text>
          </View>
        </View>

        <Pressable
          testID="creditPayment-continueButton"
          accessibilityRole="button"
          onPress={() => (valid ? confirmPayment() : undefined)}
          style={({ pressed }) => [
            localStyles.cta,
            !valid && localStyles.ctaDisabled,
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
          <Text style={localStyles.ctaText}>{t.creditContinue}</Text>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>

      </ScrollView>

      {infoOpen ? (
        <CreditDepositNoticeDialog
          testID="creditPayment-favorInfo"
          title={t.creditPayFavorInfoTitle}
          body={t.creditPayFavorInfoBody}
          acceptLabel={t.creditPayFavorInfoClose}
          onCancel={() => setInfoOpen(false)}
          onAccept={() => setInfoOpen(false)}
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
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  pressed: { opacity: 0.7 },
  accent: { color: "#FFFFFF" },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  infoRow: {
    ...panel,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  infoValue: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text.primary,
  },
  infoSub: {
    ...typography.caption,
    fontSize: 12,
  },
  question: {
    ...typography.h2,
    fontSize: 19,
    lineHeight: 24,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  options: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  option: {
    ...panel,
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.md,
  },
  optionActive: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.text.primary,
  },
  optionValue: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputLabel: {
    ...typography.body,
    fontSize: 14,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 60,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface,
  },
  inputBoxError: {
    borderColor: colors.danger,
  },
  dollar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  dollarText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clear: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  favor: {
    ...panel,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary,
  },
  favorLabel: {
    ...typography.caption,
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  favorValue: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text.primary,
  },
  favorInfo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  notice: {
    ...panel,
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  noticeBody: {
    flex: 1,
    gap: 2,
  },
  noticeTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
  },
  noticeDesc: {
    ...typography.caption,
    fontSize: 13,
  },
  cta: {
    marginTop: spacing.lg,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    overflow: "hidden",
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
});
