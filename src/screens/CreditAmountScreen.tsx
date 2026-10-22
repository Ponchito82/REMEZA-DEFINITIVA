import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ChevronRight, Pencil } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { CreditCardArt, CreditFlowHeader } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import CreditDepositNoticeDialog from "../components/ui/CreditDepositNoticeDialog";

const MIN_AMOUNT = 300;
const MAX_AMOUNT = 800;
const PRESETS = [300, 400, 500, 600, 700, 800];

type Props = {
  t: any;
  holderName?: string;
  /** Saldo de la tarjeta digital: el limite no puede superarlo. */
  availableUsdBalance: number;
  setIsMenuOpen: (value: boolean) => void;
  onBack: () => void;
  /** "Continuar": aun sin siguiente paso, se conecta mas adelante. */
  onContinue?: (amountUsd: number) => void;
};

export default function CreditAmountScreen({ t, holderName, availableUsdBalance, setIsMenuOpen, onBack, onContinue }: Props) {
  const maxAmount = Math.min(MAX_AMOUNT, Math.floor(availableUsdBalance));
  const [selected, setSelected] = useState<number | null>(
    PRESETS[0] <= maxAmount ? PRESETS[0] : null,
  );
  const [custom, setCustom] = useState("");
  const [showNotice, setShowNotice] = useState(false);

  const customValue = custom ? Number(custom) : null;
  const amount = customValue ?? selected;
  const valid = amount !== null && amount >= MIN_AMOUNT && amount <= maxAmount;
  const customInvalid = customValue !== null && !valid;

  const pickPreset = (value: number) => {
    setSelected(value);
    setCustom("");
  };

  const changeCustom = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 5);
    setCustom(digits);
    setSelected(null);
  };

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader
        testIDPrefix="creditAmount"
        onMenu={() => setIsMenuOpen(true)}
        onBack={onBack}
        backLabel={t.back}
        steps={6}
        currentStep={1}
      />

      <ScrollView
        contentContainerStyle={localStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={localStyles.title}>{t.creditHistoryHeadline}</Text>
        <Text style={[localStyles.title, localStyles.titleAccent]}>{t.creditHistoryHeadlineAccent}</Text>
        <Text style={localStyles.subtitle}>{t.creditAmountSubtitle}</Text>

        <CreditCardArt t={t} holderName={holderName} />

        <Text style={localStyles.sectionTitle}>{t.creditAmountSelect}</Text>
        <Text style={localStyles.sectionHint}>{t.creditAmountLimitNote}</Text>

        <View style={localStyles.grid}>
          {PRESETS.map((value) => {
            const active = selected === value && !custom;
            const disabled = value > maxAmount;
            return (
              <Pressable
                key={value}
                testID={`creditAmount-preset-${value}`}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                disabled={disabled}
                onPress={() => pickPreset(value)}
                style={({ pressed }) => [
                  localStyles.chip,
                  active && localStyles.chipActive,
                  disabled && localStyles.ctaDisabled,
                  pressed && localStyles.pressed,
                ]}
              >
                <Text style={localStyles.chipText}>${value}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[localStyles.otherBox, customInvalid && localStyles.otherBoxError]}>
          <View style={localStyles.otherIcon}>
            <Pencil size={18} color={colors.text.primary} strokeWidth={2} />
          </View>
          <View style={localStyles.otherBody}>
            <Text style={localStyles.otherLabel}>{t.creditAmountOther}</Text>
            <View style={localStyles.otherInputRow}>
              <Text style={[localStyles.otherInput, !custom && localStyles.otherPlaceholder]}>$</Text>
              <TextInput
                testID="creditAmount-customInput"
                value={custom}
                onChangeText={changeCustom}
                keyboardType="number-pad"
                placeholder="0.00"
                placeholderTextColor={colors.text.placeholder}
                style={[localStyles.otherInput, localStyles.otherField]}
              />
            </View>
          </View>
        </View>

        <Text style={[localStyles.rangeNote, customInvalid && localStyles.rangeNoteError]}>
          {maxAmount < MIN_AMOUNT
            ? t.creditAmountInsufficient
            : customValue !== null && customValue > maxAmount
            ? t.creditAmountExceedsBalance.replace("{max}", String(maxAmount))
            : t.creditAmountRange}
        </Text>

        <Pressable
          testID="creditAmount-continueButton"
          accessibilityRole="button"
          onPress={() => (valid ? setShowNotice(true) : undefined)}
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

      {showNotice ? (
        <CreditDepositNoticeDialog
          title={t.creditDepositNoticeTitle}
          body={t.creditDepositNoticeBody}
          acceptLabel={t.creditDepositNoticeAccept}
          cancelLabel={t.creditDepositNoticeCancel}
          onCancel={() => setShowNotice(false)}
          onAccept={() => {
            setShowNotice(false);
            if (amount !== null) onContinue?.(amount);
          }}
        />
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    ...typography.h1,
    fontSize: 30,
    lineHeight: 36,
  },
  titleAccent: {
    color: "#FFFFFF",
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 19,
    lineHeight: 24,
    marginTop: spacing.xl,
  },
  sectionHint: {
    ...typography.body,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    width: "31.5%",
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primaryLight,
    backgroundColor: "rgba(75,35,250,0.35)",
  },
  chipText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.primary,
  },
  otherBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  otherBoxError: {
    borderColor: colors.danger,
  },
  otherIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  otherBody: {
    flex: 1,
  },
  otherLabel: {
    ...typography.caption,
  },
  otherInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  otherInput: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.text.primary,
    includeFontPadding: false,
    paddingVertical: 0,
  },
  otherField: {
    flex: 1,
    marginLeft: 2,
  },
  otherPlaceholder: {
    color: colors.text.placeholder,
  },
  rangeNote: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  rangeNoteError: {
    color: colors.danger,
  },
  cta: {
    marginTop: spacing.xl,
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
