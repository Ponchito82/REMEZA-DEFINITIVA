import React, { useRef } from "react";
import { View, TextInput, Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  length?: number;
  onBlur?: () => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
};

const BOX_HEIGHT = 72;
const DOT_SIZE = 10;

/**
 * Clave de acceso en puntos.
 *
 * El `TextInput` va con `opacity: 0` y no con `display: "none"`: debe seguir en
 * la jerarquia de vistas para que Appium lo encuentre por `resourceId` y le
 * haga `setValue`.
 */
export default function PinDotsInput({
  value,
  onChangeText,
  length = 6,
  onBlur,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const input = useRef<TextInput | null>(null);

  return (
    <Pressable onPress={() => input.current?.focus()} style={[styles.root, style]}>
      <View style={styles.dots} pointerEvents="none">
        {Array.from({ length }, (_, index) => (
          <View key={index} style={[styles.dot, index < value.length && styles.dotFilled]} />
        ))}
      </View>

      <TextInput
        ref={input}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/\D/g, "").slice(0, length))}
        onBlur={onBlur}
        keyboardType="number-pad"
        maxLength={length}
        secureTextEntry
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: BOX_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    gap: spacing.xl,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "rgba(124,122,168,0.4)",
  },
  dotFilled: {
    backgroundColor: colors.text.primary,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
