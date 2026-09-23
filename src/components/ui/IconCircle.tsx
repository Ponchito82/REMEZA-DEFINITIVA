import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme/colors";
import { heroCircle } from "../../theme/gradients";
import Glow from "./Glow";
import type { IconComponent } from "./GlassInput";

type Props = {
  icon: IconComponent;
  /** Diametro en dp */
  size: number;
  /** Color del trazo del icono */
  color?: string;
  background?: string;
  /** Halo morado alrededor, para los circulos protagonistas de una pantalla */
  glow?: boolean;
  /**
   * Relleno con el degradado del diseno y anillo de 2px. Lo usan las pantallas
   * de seguridad; sin el, el circulo queda plano como hasta ahora.
   */
  hero?: boolean;
  /** El icono va relleno en vez de solo trazo */
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Circulo con un icono dentro: badge de input, check de exito, candado. */
export default function IconCircle({
  icon: Icon,
  size,
  color,
  background = colors.surfaceStrong,
  glow = false,
  hero = false,
  filled = false,
  style,
  testID,
}: Props) {
  const strokeColor = color ?? (hero ? colors.heroCircle.icon : colors.primaryLight);

  const circle = (
    <View
      testID={testID}
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: hero ? "transparent" : background,
        },
        hero && styles.heroRing,
        /* Con glow, el `style` externo va al envoltorio: si cae aqui, sus
           margenes estiran la caja del halo y el brillo sale rectangular. */
        !glow && style,
      ]}
    >
      {hero ? (
        <LinearGradient
          colors={heroCircle.colors}
          locations={heroCircle.locations}
          start={heroCircle.start}
          end={heroCircle.end}
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        />
      ) : null}

      <Icon
        size={hero ? size * 0.46 : size * 0.42}
        color={strokeColor}
        strokeWidth={2}
        {...(filled ? { fill: strokeColor } : null)}
      />
    </View>
  );

  if (!glow) return circle;

  return (
    <Glow
      radius={hero ? 24 : 18}
      opacity={hero ? 0.7 : 0.45}
      corner={size / 2}
      style={[styles.glowWrap, { width: size, height: size }, style]}
    >
      {circle}
    </Glow>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  heroRing: {
    borderWidth: 2,
    borderColor: colors.heroCircle.ring,
  },
  glowWrap: {
    alignSelf: "center",
  },
});
