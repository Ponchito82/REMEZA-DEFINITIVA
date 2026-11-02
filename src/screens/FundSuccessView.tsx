import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";

import { colors } from "../theme/colors";
import { fontFamily, typography } from "../theme/typography";
import { spacing } from "../theme/spacing";
import { Button, GlassCard } from "../components/ui";
import ScreenLayout from "../components/ui/ScreenLayout";

type Props = {
  t: any;
  amount: number;
  cardName: string;
  /** Vuelve a "Mis tarjetas virtuales". */
  onDone: () => void;
};

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Resultado de "Fondear saldo": pantalla propia en lugar de un aviso en el formulario. */
export default function FundSuccessView({ t, amount, cardName, onDone }: Props) {
  return (
    <ScreenLayout testID="fundSuccess" footer={<Button testID="fundSuccess-doneButton" title={t.fundSuccessCta} onPress={onDone} />}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Check size={44} color="#FFFFFF" strokeWidth={3} />
        </View>
        <Text style={[typography.h1, styles.title]}>{t.fundSuccessTitle}</Text>
        <Text style={[typography.body, styles.subtitle]}>{t.fundSuccessSubtitle}</Text>

        <GlassCard size="lg" style={styles.panel}>
          <Text style={typography.caption}>{t.fundSuccessAmount}</Text>
          <Text testID="fundSuccess-amount" style={styles.amount}>
            {money(amount)}
          </Text>
          <Text style={typography.caption}>{t.fundSuccessCard}</Text>
          <Text testID="fundSuccess-card" style={typography.bodyStrong}>
            {cardName}
          </Text>
        </GlassCard>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", paddingTop: spacing.xxl, gap: spacing.md },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", color: colors.text.secondary },
  panel: { alignSelf: "stretch", gap: spacing.xs, marginTop: spacing.lg },
  amount: { fontFamily: fontFamily.bold, fontSize: 32, color: colors.text.primary, marginBottom: spacing.sm },
});
