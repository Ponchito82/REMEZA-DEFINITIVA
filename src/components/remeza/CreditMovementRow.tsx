import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  CircleArrowDown,
  Fuel,
  Pill,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Utensils,
} from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily, typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { CreditMovement, CreditMovementIcon } from "../../utils/creditSimulation";
import type { Language } from "../../types/app";

const ICONS: Record<CreditMovementIcon, React.ComponentType<any>> = {
  bag: ShoppingBag,
  food: Utensils,
  payment: CircleArrowDown,
  cart: ShoppingCart,
  fuel: Fuel,
  shirt: Shirt,
  pharmacy: Pill,
  electronics: Smartphone,
};

const MONTHS: Record<Language, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

type Props = {
  t: any;
  language: Language;
  movement: CreditMovement;
  testID?: string;
};

/** Fila de un movimiento de la tarjeta de credito: compra en blanco, pago en verde. */
export default function CreditMovementRow({ t, language, movement, testID }: Props) {
  const Icon = ICONS[movement.icon];
  const isPayment = movement.kind === "payment";
  const date = new Date(movement.at);
  const dateText = `${String(date.getDate()).padStart(2, "0")} ${MONTHS[language][date.getMonth()]} ${date.getFullYear()}`;

  return (
    <View testID={testID} style={styles.row}>
      <View style={[styles.icon, isPayment && styles.iconPayment]}>
        <Icon size={20} color={isPayment ? colors.success : colors.text.primary} strokeWidth={2} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{t[movement.nameKey]}</Text>
        <Text style={styles.date}>{dateText}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isPayment && styles.amountPayment]}>
          {isPayment ? "+" : "-"}${movement.amountUsd.toLocaleString("en-US")}
        </Text>
        <Text style={styles.kind}>{isPayment ? t.creditKindPayment : t.creditKindPurchase}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(75,35,250,0.45)",
  },
  iconPayment: {
    backgroundColor: colors.successBg,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
  },
  date: {
    ...typography.caption,
    fontSize: 12,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.primary,
  },
  amountPayment: {
    color: colors.success,
  },
  kind: {
    ...typography.caption,
    fontSize: 12,
  },
});
