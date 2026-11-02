import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Info, Wallet } from "lucide-react-native";

import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { AmountInput, Badge, Button, GlassCard, ScreenHeader } from "../components/ui";
import ScreenLayout from "../components/ui/ScreenLayout";
import { VirtualCardArt } from "../components/remeza";
import type { VirtualCardColor } from "../components/remeza";

type Props = {
  t: any;
  availableUsdBalance: number;
  onBack: () => void;
  /** Colores ya usados por otras tarjetas (sin disenos repetidos). */
  usedColors: VirtualCardColor[];
  onCreate: (color: VirtualCardColor, amount: number) => void;
};

/** Orden de generacion: la primera negra, luego morada y al final blanca. */
const COLORS: VirtualCardColor[] = ["black", "purple", "white"];
const AMOUNTS = [300, 500, 800];

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Nueva tarjeta virtual: el diseno lo asigna la app en orden (negra, morada,
 * blanca) y se fondea desde el saldo disponible. Crear lleva a la pantalla de exito; aun no llama al API.
 */
export default function NewCardView({ t, availableUsdBalance, onBack, usedColors, onCreate }: Props) {
  // El cliente no elige el diseno: se generan en orden fijo.
  const nextColor = COLORS.find((c) => !usedColors.includes(c));
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");

  const pickAmount = (value: number) => {
    setAmount(value);
    setCustom("");
  };

  const onCustomChange = (value: string) => {
    setCustom(value);
    setAmount(Number(value) || 0);
  };

  return (
    <ScreenLayout
      showBack
      onBack={onBack}
      backTestID="newCard-backButton"
      backAccessibilityLabel={t.back}
      keyboard
      testID="newCard"
    >
      <ScreenHeader title={t.newCardTitle} subtitle={t.newCardSubtitle} style={styles.header} />

      <GlassCard size="lg" style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={typography.h2}>{t.newCardYours}</Text>
          <Badge label={t.newCardBadge} variant="virtual" />
        </View>

        <View style={styles.cardBox}>
          {nextColor ? (
            <VirtualCardArt testID="newCard-card" color="glass" width={260} />
          ) : null}
        </View>

        <View style={styles.info}>
          <Info size={18} color={colors.primaryLight} strokeWidth={2} />
          <Text style={[typography.caption, styles.infoText]}>{t.newCardInfo}</Text>
        </View>
      </GlassCard>

      <GlassCard size="lg" style={styles.panel}>
        <Text style={typography.h2}>
          {usedColors.length === 0 ? t.newCardFundFirstTitle : t.newCardFundTitle}
        </Text>

        <View style={styles.account}>
          <View style={styles.accountIcon}>
            <Wallet size={20} color={colors.primaryLight} strokeWidth={2} />
          </View>
          <View style={styles.accountText}>
            <Text style={typography.caption}>{t.newCardAccountBalance}</Text>
            <Text style={styles.accountBalance}>{money(availableUsdBalance)}</Text>
          </View>
        </View>

        <Text style={[typography.caption, styles.amountLabel]}>{t.newCardAmountLabel}</Text>
        <View style={styles.amounts}>
          {AMOUNTS.map((value) => {
            const selected = !custom && amount === value;
            const unaffordable = value > availableUsdBalance;
            return (
              <Pressable
                key={value}
                testID={`newCard-amount-${value}`}
                accessibilityRole="button"
                disabled={unaffordable}
                onPress={() => pickAmount(value)}
                style={[
                  styles.amount,
                  selected && styles.amountSelected,
                  unaffordable && { opacity: 0.4 },
                ]}
              >
                <Text style={styles.amountText}>${value}</Text>
              </Pressable>
            );
          })}
        </View>

        <AmountInput
          testID="newCard-customAmount"
          label={t.newCardOtherAmount}
          value={custom}
          onChangeText={onCustomChange}
          placeholder={t.newCardOtherPlaceholder}
          error={amount > availableUsdBalance ? t.newCardInsufficient : undefined}
          style={styles.custom}
        />
      </GlassCard>

      <Button
        testID="newCard-createButton"
        title={t.newCardCreate}
        disabled={
          amount <= 0 || amount > 800 || amount > availableUsdBalance || !nextColor
        }
        onPress={() => nextColor && onCreate(nextColor, amount)}
        style={styles.cta}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  panel: {
    backgroundColor: colors.sheetSurface,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBox: { alignItems: "center", paddingVertical: spacing.sm },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.35)",
  },
  infoText: { flex: 1 },
  account: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  accountText: { flex: 1, gap: 2 },
  accountBalance: { ...typography.h2, fontFamily: fontFamily.bold },
  amountLabel: { marginTop: spacing.xs },
  amounts: { flexDirection: "row", gap: spacing.sm },
  amount: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(130,110,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  amountSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: "rgba(75,35,250,0.35)",
  },
  amountText: { ...typography.bodyStrong },
  custom: { marginTop: spacing.xs },
  cta: { marginBottom: spacing.xl },
});
