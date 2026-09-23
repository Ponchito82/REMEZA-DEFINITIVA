import React from "react";
import { Pressable, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = {
  children: string;
  onPress: () => void;
  /**
   * `accent` en violeta claro, `plain` en blanco semibold, `magenta` para el
   * link de soporte de las pantallas de seguridad.
   */
  tone?: "accent" | "plain" | "magenta";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
};

/** Texto pulsable: "Paste code", "Show Data", "Forgot your access code?". */
export default function LinkText({
  children,
  onPress,
  tone = "accent",
  disabled = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? children}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <Text
        style={[
          typography.bodyStrong,
          tone === "accent" && styles.accent,
          tone === "magenta" && styles.magenta,
          disabled && styles.disabled,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accent: {
    color: colors.primaryLight,
  },
  magenta: {
    color: colors.accentMagenta,
  },
  disabled: {
    color: colors.text.placeholder,
  },
  pressed: {
    opacity: 0.7,
  },
});
