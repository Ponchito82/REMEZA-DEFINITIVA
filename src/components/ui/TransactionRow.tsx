import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles, fontFamily } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import Avatar from "./Avatar";

type Props = {
  title: string;
  /** Fecha ya formateada */
  date: string;
  /** Estado ya traducido; va tras la fecha con un punto medio */
  status?: string;
  statusColor?: string;
  /** Monto con signo tal como lo entrega la logica ("+$500.00", "-$46.20") */
  amount: string;
  currency?: string;
  /** Avatar u otro elemento a la izquierda; por defecto, iniciales del titulo */
  leading?: React.ReactNode;
  /** Monto tachado, para movimientos cancelados */
  struck?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Fila del historial: avatar, titulo, "fecha · estado" y monto con moneda.
 * El positivo va en verde y con "+"; el negativo, en blanco.
 */
export default function TransactionRow({
  title,
  date,
  status,
  statusColor,
  amount,
  currency,
  leading,
  struck = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const positive = amount.trim().startsWith("+");

  const body = (
    <>
      {leading ?? <Avatar name={title} size={44} />}

      <View style={styles.center}>
        <Text style={textStyles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {date}
          {status ? (
            <Text style={statusColor ? { color: statusColor } : null}>{`  ·  ${status}`}</Text>
          ) : null}
        </Text>
      </View>

      <View style={styles.right}>
        <Text
          testID={testID ? `${testID}-amount` : undefined}
          style={[
            styles.amount,
            { color: positive ? tokens.successText : tokens.textPrimary },
            struck && styles.struck,
          ]}
        >
          {amount}
        </Text>
        {currency ? <Text style={styles.currency}>{currency}</Text> : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View testID={testID} style={[styles.root, style]}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 68,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: tokens.glassSurface,
  },
  pressed: {
    backgroundColor: "rgba(84,32,255,0.18)",
  },
  center: {
    flex: 1,
    gap: 2,
  },
  meta: {
    ...textStyles.caption,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
    includeFontPadding: false,
  },
  currency: {
    ...textStyles.caption,
    fontSize: 12,
  },
  struck: {
    textDecorationLine: "line-through",
    color: tokens.textDisabled,
  },
});
