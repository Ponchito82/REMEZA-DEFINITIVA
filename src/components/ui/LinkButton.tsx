import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { fontFamily, fontSize, palette } from "../../theme/designSystem";
import type { IconComponent } from "./GlassField";

type Props = {
  label: string;
  onPress: () => void;
  /** Icono opcional de lucide-react-native a la izquierda */
  icon?: IconComponent;
  /** "violet" para enlaces auxiliares, "light" para acciones destacadas */
  tone?: "violet" | "light";
  testID?: string;
  style?: ViewStyle;
};

/** Enlace de texto sobre fondo oscuro, con icono opcional. */
export default function LinkButton({
  label,
  onPress,
  icon: Icon,
  tone = "violet",
  testID,
  style,
}: Props) {
  const color = tone === "light" ? palette.textPrimary : "#9C86FF";

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      {Icon ? <Icon size={22} color={color} strokeWidth={2} /> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    alignSelf: "center",
    paddingVertical: 8,
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption + 1,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
