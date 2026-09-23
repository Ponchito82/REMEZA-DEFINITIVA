import React from "react";
import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { X, ChevronLeft, ArrowLeft } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { sizes } from "../../theme/radius";

type Props = {
  onPress: () => void;
  /** `close` cierra la pantalla; `chevron` y `arrow` retroceden. */
  icon?: "close" | "chevron" | "arrow";
  /** El menu lateral lo usa redondo; las pantallas, cuadrado. */
  shape?: "square" | "circle";
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const ICONS = { close: X, chevron: ChevronLeft, arrow: ArrowLeft } as const;

/** Boton de cerrar o retroceder. Misma caja en las tres variantes. */
export default function CloseButton({
  onPress,
  icon = "close",
  shape = "square",
  testID,
  accessibilityLabel = "Close",
  style,
}: Props) {
  const Icon = ICONS[icon];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.root,
        shape === "circle" && styles.circle,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon size={20} color={colors.text.primary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: sizes.closeButton,
    height: sizes.closeButton,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  circle: {
    borderRadius: sizes.closeButton / 2,
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.7,
  },
});
