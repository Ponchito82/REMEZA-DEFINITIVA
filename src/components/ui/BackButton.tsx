import React from "react";
import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { metrics } from "../../theme/radius";

type Props = {
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Boton de retroceso del diseno: cuadro de 44 con chevron. */
export default function BackButton({
  onPress,
  testID,
  accessibilityLabel = "Back",
  style,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      <ChevronLeft size={22} color={tokens.textPrimary} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: metrics.backButton,
    height: metrics.backButton,
    borderRadius: metrics.radius.back,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.backButtonFill,
    borderWidth: 1,
    borderColor: tokens.backButtonBorder,
  },
  /** Sin `opacity`: el estado presionado cambia de relleno. */
  pressed: {
    backgroundColor: tokens.indigoDeep,
  },
});
