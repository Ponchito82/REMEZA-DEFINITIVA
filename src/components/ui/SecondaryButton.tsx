import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import type { IconComponent } from "./GlassInput";

type Tone = "neutral" | "danger" | "accent";

type Props = {
  title: string;
  onPress: () => void;
  tone?: Tone;
  iconLeft?: IconComponent;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

const TONES: Record<Tone, { border: string; text: string }> = {
  neutral: { border: tokens.glassBorder, text: tokens.textPrimary },
  danger: { border: tokens.danger, text: tokens.dangerText },
  accent: { border: tokens.violet, text: tokens.textLink },
};

/** Boton de contorno: transparente, borde de 1 y el mismo alto que el principal. */
export default function SecondaryButton({
  title,
  onPress,
  tone = "neutral",
  iconLeft: IconLeft,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const palette = TONES[tone];
  const textColor = disabled ? tokens.textDisabled : palette.text;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        { borderColor: disabled ? tokens.glassBorder : palette.border },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.label}>
        {IconLeft ? <IconLeft size={20} color={textColor} strokeWidth={1.75} /> : null}
        <Text style={[textStyles.button, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "stretch",
    height: metrics.buttonHeight,
    borderRadius: metrics.radius.button,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  pressed: {
    backgroundColor: tokens.glassSurface,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
