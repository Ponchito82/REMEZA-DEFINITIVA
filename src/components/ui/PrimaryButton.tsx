import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { ArrowRight } from "lucide-react-native";
import { fontFamily, fontSize, palette } from "../../theme/designSystem";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Circulo con flecha al costado derecho */
  showArrow?: boolean;
  testID?: string;
  style?: ViewStyle;
};

const HEIGHT = 62;

/**
 * CTA principal: pastilla con degradado corporativo, borde luminoso y
 * circulo translucido con flecha.
 */
export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  showArrow = true,
  testID,
  style,
}: Props) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.clip}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="remezaCta" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#33169E" />
              <Stop offset="0.5" stopColor={palette.violet} />
              <Stop offset="1" stopColor={palette.violetBright} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#remezaCta)" />
        </Svg>

        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>

        {showArrow ? (
          <View style={styles.arrow}>
            <ArrowRight size={22} color={palette.textPrimary} strokeWidth={2.5} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    shadowColor: palette.violetBright,
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  clip: {
    flex: 1,
    borderRadius: HEIGHT / 2,
    borderWidth: 1,
    borderColor: "rgba(170,150,255,0.55)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily,
    fontSize: fontSize.subtitle,
    fontWeight: "700",
    color: palette.textPrimary,
    letterSpacing: 0.2,
  },
  arrow: {
    position: "absolute",
    right: 9,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.42,
    shadowOpacity: 0.15,
  },
});
