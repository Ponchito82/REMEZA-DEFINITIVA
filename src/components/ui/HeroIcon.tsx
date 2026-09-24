import React, { useEffect, useId, useRef } from "react";
import { Animated, Easing, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";
import { Check, X } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { metrics } from "../../theme/radius";
import { colorGlow } from "../../theme/shadows";
import type { IconComponent } from "./GlassInput";

export type HeroTone = "default" | "danger" | "success" | "warning";

type Props = {
  icon: IconComponent;
  /** `filled`: circulo con degradado. `ring`: fondo oscuro con aro de color. */
  variant?: "filled" | "ring";
  tone?: HeroTone;
  /** Insignia de 28 abajo a la derecha */
  badge?: "check" | "x";
  /** Arco girando alrededor, para estados "procesando" */
  spinning?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const TONE_COLOR: Record<HeroTone, string> = {
  default: tokens.violetBright,
  danger: tokens.danger,
  success: tokens.success,
  warning: tokens.warningText,
};

const RING_WIDTH = 2.5;
const BADGE = 28;

/**
 * Icono protagonista de una pantalla. El circulo, su relleno y su aro se
 * dibujan dentro de un solo Svg: redondear con `overflow: "hidden"` deja el
 * borde dentado en Android.
 */
export default function HeroIcon({
  icon: Icon,
  variant = "filled",
  tone = "default",
  badge,
  spinning = false,
  size = metrics.heroIcon,
  style,
  testID,
}: Props) {
  const toneColor = TONE_COLOR[tone];
  const isRing = variant === "ring";
  const glowColor = isRing ? toneColor : tokens.violet;
  const iconColor = isRing ? toneColor : tokens.iconAccent;
  const r = size / 2;
  /** Id propio: dos HeroIcon en pantalla no deben compartir el degradado. */
  const fillId = `heroFill${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!spinning) return;
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spinning, rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const arcRadius = r - RING_WIDTH / 2;

  return (
    <View
      testID={testID}
      style={[
        styles.root,
        { width: size, height: size, borderRadius: r },
        colorGlow(glowColor, 0.45, 20),
        style,
      ]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={fillId} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={tokens.purple} />
            <Stop offset="1" stopColor={tokens.indigoDeep} />
          </RadialGradient>
        </Defs>

        {isRing ? (
          <Circle
            cx={r}
            cy={r}
            r={r - RING_WIDTH / 2}
            fill="#0B0A2E"
            stroke={toneColor}
            strokeWidth={RING_WIDTH}
          />
        ) : (
          <Circle
            cx={r}
            cy={r}
            r={r - 0.75}
            fill={`url(#${fillId})`}
            stroke="rgba(160,120,255,0.6)"
            strokeWidth={1.5}
          />
        )}
      </Svg>

      {spinning ? (
        <Animated.View
          style={[StyleSheet.absoluteFill, { transform: [{ rotate: spin }] }]}
          pointerEvents="none"
        >
          <Svg width={size} height={size}>
            <Path
              d={`M${r} ${RING_WIDTH / 2} A${arcRadius} ${arcRadius} 0 0 1 ${size - RING_WIDTH / 2} ${r}`}
              stroke={tokens.textPrimary}
              strokeWidth={RING_WIDTH}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      ) : null}

      <Icon size={size * 0.46} color={iconColor} strokeWidth={1.75} />

      {badge ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: badge === "check" ? tokens.violet : tokens.danger },
          ]}
        >
          {badge === "check" ? (
            <Check size={16} color={tokens.textPrimary} strokeWidth={2.5} />
          ) : (
            <X size={16} color={tokens.textPrimary} strokeWidth={2.5} />
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: tokens.background,
  },
});
