import React from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { brandDiagonal, brandHorizontal } from "../../theme/gradients";
import Glow from "./Glow";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  gradient?: "diagonal" | "horizontal";
  testID?: string;
  style?: ViewStyle;
};

const HEIGHT = 60;
const RADIUS = HEIGHT / 2;

/**
 * CTA de marca: pastilla con degradado, filo de luz y circulo con flecha.
 *
 * Deshabilitado **no usa `opacity`**: eso deslava el conjunto entero, texto
 * incluido. En su lugar cambia a una superficie solida con su propio color de
 * texto, que se lee nitido.
 */
export default function GradientButton({
  title,
  onPress,
  disabled = false,
  showArrow = true,
  gradient = "diagonal",
  testID,
  style,
}: Props) {
  const ramp = gradient === "horizontal" ? brandHorizontal : brandDiagonal;

  const surface = (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.root,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabledSurface,
      ]}
    >
      {!disabled ? (
        <>
          {/* Con degradado no hay contorno: solo el filo de luz de arriba.
              Borde y filo a la vez se leen como doble borde. */}
          <LinearGradient
            colors={ramp.colors}
            locations={ramp.locations}
            start={ramp.start}
            end={ramp.end}
            style={[StyleSheet.absoluteFill, styles.surface]}
          />
          <View style={styles.lightLine} pointerEvents="none" />
        </>
      ) : null}

      <Text style={[typography.button, disabled && styles.labelDisabled]} numberOfLines={1}>
        {title}
      </Text>

      {showArrow ? (
        <View style={[styles.arrow, disabled && styles.arrowDisabled]} pointerEvents="none">
          <ArrowRight
            size={20}
            color={disabled ? colors.textDisabled : colors.textPrimary}
            strokeWidth={2}
          />
        </View>
      ) : null}
    </Pressable>
  );

  if (disabled) return <View style={style}>{surface}</View>;

  return (
    <Glow radius={16} opacity={0.4} offsetY={6} corner={RADIUS} stretch style={style}>
      {surface}
    </Glow>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: HEIGHT,
    borderRadius: RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  surface: {
    borderRadius: RADIUS,
  },
  disabledSurface: {
    backgroundColor: colors.indigoDeep,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  lightLine: {
    position: "absolute",
    top: 0,
    left: RADIUS,
    right: RADIUS,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
  arrow: {
    position: "absolute",
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDisabled: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
