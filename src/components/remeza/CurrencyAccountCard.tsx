import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { FlagIcon } from "../ui";
import type { FlagCountry } from "../ui";

type Props = {
  country: FlagCountry;
  /** "USD" */
  code: string;
  /** "Dólar estadounidense" */
  name: string;
  balance: number;
  /** Prefijo del monto. El diseno usa "$" para las dos monedas. */
  currencySymbol?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function formatBalance(value: number, symbol: string): string {
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Fila de una cuenta en divisa, con su bandera y su saldo. */
export default function CurrencyAccountCard({
  country,
  code,
  name,
  balance,
  currencySymbol = "$",
  onPress,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${code} ${formatBalance(balance, currencySymbol)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={["rgba(75,35,250,0.18)", "rgba(75,35,250,0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <FlagIcon country={country} />

      <View style={styles.text}>
        <Text style={styles.code} numberOfLines={1}>
          {code}
        </Text>
        <Text style={typography.listItemDescription} numberOfLines={2}>
          {name}
        </Text>
      </View>

      <Text
        testID={testID ? `${testID}-balance` : undefined}
        style={styles.balance}
        numberOfLines={1}
      >
        {formatBalance(balance, currencySymbol)}
      </Text>

      <ChevronRight size={20} color={colors.text.primary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  /** El monto no cede ancho, pero tampoco lo roba al nombre de la moneda. */
  balance: {
    ...typography.listItemValue,
    flexShrink: 0,
  },
  code: {
    ...typography.listItemValue,
    fontFamily: typography.infoValue.fontFamily,
  },
  pressed: {
    opacity: 0.85,
  },
});
