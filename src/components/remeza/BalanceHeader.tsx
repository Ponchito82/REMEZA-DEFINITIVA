import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Menu, Eye, EyeOff } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

/** Mascara del monto cuando el saldo esta oculto. */
const HIDDEN_AMOUNT = "••••••";

type Props = {
  label: string;
  amount: string;
  onMenuPress: () => void;
  /** Sin este prop el saldo no es pulsable, como hasta ahora. */
  onBalancePress?: () => void;
  /** Sin `onToggleHidden` el boton de ocultar saldo no se dibuja. */
  hidden?: boolean;
  onToggleHidden?: () => void;
  hideBalanceAccessibilityLabel?: string;
  showBalanceAccessibilityLabel?: string;
  style?: ViewStyle;
  testID?: string;
  menuTestID?: string;
  menuAccessibilityLabel?: string;
};

const MENU_SIZE = 48;
const HIDE_BUTTON_SIZE = 36;

/** Encabezado del Home: saldo a la izquierda y acceso al menu a la derecha. */
export default function BalanceHeader({
  label,
  amount,
  onMenuPress,
  onBalancePress,
  hidden = false,
  onToggleHidden,
  hideBalanceAccessibilityLabel = "Hide balance",
  showBalanceAccessibilityLabel = "Show balance",
  style,
  testID,
  menuTestID,
  menuAccessibilityLabel = "Menu",
}: Props) {
  const displayAmount = hidden ? HIDDEN_AMOUNT : amount;

  return (
    <View style={style}>
      <View style={styles.row}>
        <Text testID={testID ? `${testID}-label` : undefined} style={typography.label}>
          {label}
        </Text>

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

      <View style={styles.balanceRow}>
        <Pressable
          testID={testID ? `${testID}-balancePressable` : undefined}
          accessibilityRole={onBalancePress ? "button" : undefined}
          accessibilityLabel={`${label} ${displayAmount}`}
          onPress={onBalancePress}
          disabled={!onBalancePress}
          style={styles.balance}
        >
          <Text testID={testID ? `${testID}-amount` : undefined} style={styles.amount}>
            {displayAmount}
          </Text>
        </Pressable>

        {onToggleHidden ? (
          <Pressable
            testID={testID ? `${testID}-hideToggle` : undefined}
            accessibilityRole="button"
            accessibilityLabel={hidden ? showBalanceAccessibilityLabel : hideBalanceAccessibilityLabel}
            onPress={onToggleHidden}
            hitSlop={10}
            style={({ pressed }) => [styles.hideButton, pressed && styles.pressed]}
          >
            {hidden ? (
              <EyeOff size={18} color={colors.text.secondary} strokeWidth={2} />
            ) : (
              <Eye size={18} color={colors.primaryLight} strokeWidth={2} />
            )}
          </Pressable>
        ) : null}
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
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  balance: {
    flexShrink: 1,
  },
  amount: {
    ...typography.amount,
    fontSize: 34,
    lineHeight: 40,
  },
  hideButton: {
    width: HIDE_BUTTON_SIZE,
    height: HIDE_BUTTON_SIZE,
    borderRadius: HIDE_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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
