import React, { useEffect, useState } from "react";
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";

type Props = {
  /** Segundos de la cuenta atras */
  seconds: number;
  onResend: () => void;
  /** "Reenviar código" */
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function format(total: number): string {
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * Cuenta atras para reenviar un codigo. Mientras corre es solo texto; al
 * llegar a cero se vuelve pulsable y se reinicia al tocarlo.
 */
export default function CountdownText({
  seconds,
  onResend,
  label,
  style,
  testID,
}: Props) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const timer = setInterval(() => setLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [left]);

  if (left > 0) {
    return (
      <Text testID={testID} style={[styles.waiting, style]}>
        {`${label} (${format(left)})`}
      </Text>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        setLeft(seconds);
        onResend();
      }}
      hitSlop={8}
      style={style}
    >
      <Text style={styles.ready}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  waiting: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text.placeholder,
    textAlign: "center",
    includeFontPadding: false,
  },
  ready: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    color: colors.primaryLight,
    textAlign: "center",
    includeFontPadding: false,
  },
});
