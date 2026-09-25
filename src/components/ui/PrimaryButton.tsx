import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import { colorGlow } from "../../theme/shadows";
import type { IconComponent } from "./GlassInput";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: IconComponent;
  /** Flecha a la derecha */
  showArrow?: boolean;
  tone?: "primary" | "danger";
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

const GRADIENT = ["#3A00FA", "#4A10FF", "#6A1CFF"];
const GRADIENT_LOCATIONS = [0, 0.6, 1];

/**
 * Boton principal del diseno. Deshabilitado no usa `opacity`, que deslava el
 * texto: cambia a su propia superficie apagada.
 */
export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  iconLeft: IconLeft,
  showArrow = false,
  tone = "primary",
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const blocked = disabled || loading;
  const isDanger = tone === "danger";

  const glow = blocked
    ? null
    : isDanger
      ? colorGlow(tokens.danger, 0.35, 16, 6)
      : colorGlow(tokens.violet, 0.4, 16, 6);

  const labelColor = blocked ? tokens.textDisabled : tokens.textPrimary;

  return (
    <View style={[styles.wrap, glow, style]}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: blocked, busy: loading }}
        onPress={onPress}
        disabled={blocked}
        style={({ pressed }) => [
          styles.root,
          isDanger && !blocked && styles.danger,
          blocked && styles.blocked,
          pressed && !blocked && styles.pressed,
        ]}
      >
        {!blocked && !isDanger ? (
          <LinearGradient
            colors={GRADIENT}
            locations={GRADIENT_LOCATIONS}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fill}
            pointerEvents="none"
          />
        ) : null}

        {!blocked ? <View style={styles.topLight} pointerEvents="none" /> : null}

        {loading ? (
          <ActivityIndicator color={tokens.textPrimary} />
        ) : (
          <View style={styles.label}>
            {IconLeft ? <IconLeft size={20} color={labelColor} strokeWidth={1.75} /> : null}
            <Text style={[textStyles.button, { color: labelColor }]} numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}

        {showArrow && !loading ? (
          <View style={styles.arrow} pointerEvents="none">
            <ArrowRight size={22} color={labelColor} strokeWidth={1.75} />
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: "stretch",
    borderRadius: metrics.radius.button,
  },
  root: {
    height: metrics.buttonHeight,
    borderRadius: metrics.radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: metrics.radius.button,
  },
  /** Filo de luz de 1 dp en el borde superior */
  topLight: {
    position: "absolute",
    top: 0,
    left: metrics.radius.button,
    right: metrics.radius.button,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  danger: {
    backgroundColor: tokens.dangerButton,
  },
  blocked: {
    backgroundColor: tokens.indigoDeep,
    borderWidth: 1,
    borderColor: tokens.glassBorder,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  arrow: {
    position: "absolute",
    right: 20,
  },
});
