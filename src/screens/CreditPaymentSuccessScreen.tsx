import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Path } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { styles as appStyles } from "../theme/styles";
import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { primaryGradient } from "../theme/gradients";
import { CreditFlowHeader } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import { formatDueDate } from "./CreditSummaryScreen";
import type { Language } from "../types/app";

export type CreditPaymentReceipt = {
  amountUsd: number;
  at: number;
  reference: string;
  /** Saldo utilizado ya con el pago aplicado */
  remainingUsd: number;
};

type Props = {
  t: any;
  language: Language;
  receipt: CreditPaymentReceipt;
  setIsMenuOpen: (value: boolean) => void;
  onViewMovements: () => void;
  onDone: () => void;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
/** Largo aproximado del trazo de la palomita (viewBox 40x40). */
const CHECK_LENGTH = 34;

/** Palomita animada: el circulo entra con rebote, la palomita se dibuja y un aro se expande. */
function AnimatedCheck() {
  const pop = useRef(new Animated.Value(0)).current;
  const draw = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(draw, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
    Animated.timing(ripple, { toValue: 1, duration: 900, delay: 250, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [pop, draw, ripple]);

  return (
    <View style={localStyles.checkHalo}>
      <Animated.View
        pointerEvents="none"
        style={[
          localStyles.ripple,
          {
            opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
            transform: [{ scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.45] }) }],
          },
        ]}
      />
      <Animated.View style={[localStyles.checkCircle, { transform: [{ scale: pop }] }]}>
        <Svg width={40} height={40} viewBox="0 0 40 40">
          <AnimatedPath
            d="M9 21 L17 29 L31 12"
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={CHECK_LENGTH}
            strokeDashoffset={draw.interpolate({ inputRange: [0, 1], outputRange: [CHECK_LENGTH, 0] })}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function CreditPaymentSuccessScreen({
  t,
  language,
  receipt,
  setIsMenuOpen,
  onViewMovements,
  onDone,
}: Props) {
  const rows = [
    { id: "amount", label: t.creditReceiptAmount, value: money(receipt.amountUsd) },
    { id: "date", label: t.creditReceiptDate, value: formatDueDate(receipt.at, language) },
    { id: "card", label: t.creditReceiptCard, value: "•••• 1234" },
    { id: "balance", label: t.creditReceiptBalance, value: money(receipt.remainingUsd) },
    { id: "reference", label: t.creditReceiptReference, value: receipt.reference },
  ];

  return (
    <View style={appStyles.dashboardScreen}>
      <CreditFlowHeader testIDPrefix="creditPaymentSuccess" onMenu={() => setIsMenuOpen(true)} />

      <ScrollView contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        <View style={localStyles.hero}>
          <AnimatedCheck />
          <Text testID="creditPaymentSuccess-title" style={localStyles.title}>
            {t.creditPaidTitle} <Text style={localStyles.accent}>{t.creditPaidTitleAccent}</Text>
          </Text>
          <Text style={localStyles.subtitle}>{t.creditPaidSubtitle}</Text>
          <Text testID="creditPaymentSuccess-amount" style={localStyles.amount}>
            {money(receipt.amountUsd)}
          </Text>
        </View>

        <View style={localStyles.details}>
          {rows.map((row, index) => (
            <View
              key={row.id}
              style={[localStyles.detailRow, index < rows.length - 1 && localStyles.detailDivider]}
            >
              <Text style={localStyles.detailLabel}>{row.label}</Text>
              <Text style={localStyles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Pressable
          testID="creditPaymentSuccess-doneButton"
          accessibilityRole="button"
          onPress={onDone}
          style={({ pressed }) => [localStyles.cta, pressed && localStyles.pressed]}
        >
          <LinearGradient
            colors={primaryGradient.colors}
            locations={primaryGradient.locations}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={StyleSheet.absoluteFill}
          />
          <Text style={localStyles.ctaText}>{t.creditPaidDone}</Text>
          <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.4} />
        </Pressable>

        <Pressable
          testID="creditPaymentSuccess-movementsButton"
          accessibilityRole="button"
          onPress={onViewMovements}
          style={({ pressed }) => [localStyles.secondary, pressed && localStyles.pressed]}
        >
          <Text style={localStyles.secondaryText}>{t.creditPaidViewMovements}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: 40,
  },
  pressed: { opacity: 0.7 },
  accent: { color: "#FFFFFF" },
  hero: {
    alignItems: "center",
    gap: spacing.sm,
  },
  checkHalo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(43,244,165,0.12)",
    marginBottom: spacing.md,
  },
  ripple: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: colors.successIcon,
  },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.successIcon,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.success,
    marginTop: spacing.sm,
  },
  details: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  detailDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  detailLabel: {
    ...typography.caption,
    fontSize: 13,
  },
  detailValue: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
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
  ctaText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  secondary: {
    marginTop: spacing.md,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  secondaryText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.text.primary,
  },
});
