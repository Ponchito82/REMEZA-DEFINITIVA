import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Menu } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

type Props = {
  label: string;
  amount: string;
  onMenuPress: () => void;
  /** Sin este prop el saldo no es pulsable, como hasta ahora. */
  onBalancePress?: () => void;
  style?: ViewStyle;
  testID?: string;
  menuTestID?: string;
  menuAccessibilityLabel?: string;
};

const MENU_SIZE = 48;

/** Encabezado del Home: saldo a la izquierda y acceso al menu a la derecha. */
export default function BalanceHeader({
  label,
  amount,
  onMenuPress,
  onBalancePress,
  style,
  testID,
  menuTestID,
  menuAccessibilityLabel = "Menu",
}: Props) {
  return (
    <View style={style}>
      <View style={styles.row}>
        <Pressable
          testID={testID ? `${testID}-balancePressable` : undefined}
          accessibilityRole={onBalancePress ? "button" : undefined}
          accessibilityLabel={`${label} ${amount}`}
          onPress={onBalancePress}
          disabled={!onBalancePress}
          style={styles.balance}
        >
          <Text testID={testID ? `${testID}-label` : undefined} style={typography.label}>
            {label}
          </Text>
          <Text testID={testID ? `${testID}-amount` : undefined} style={styles.amount}>
            {amount}
          </Text>
        </Pressable>

        <Pressable
          testID={menuTestID}
          accessibilityRole="button"
          accessibilityLabel={menuAccessibilityLabel}
          onPress={onMenuPress}
          style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
        >
          <Menu size={22} color={colors.text.primary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  balance: {
    flexShrink: 1,
  },
  amount: {
    ...typography.amount,
    marginTop: spacing.xs,
  },
  menu: {
    width: MENU_SIZE,
    height: MENU_SIZE,
    borderRadius: MENU_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  divider: {
    height: 1,
    marginTop: spacing.lg,
    backgroundColor: colors.borderSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
});
