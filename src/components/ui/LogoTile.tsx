import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { logoTile } from "../../theme/gradients";
import Glow from "./Glow";
import RemezaLogo from "./RemezaLogo";

type Props = {
  /** Lado del cuadro en dp */
  size: number;
  /** Radio de las esquinas en dp */
  radius: number;
  style?: ViewStyle;
};

/** Cuadro de marca: degradado corporativo con la "R" blanca centrada. */
export default function LogoTile({ size, radius, style }: Props) {
  return (
    <View style={[styles.root, style]}>
      <Glow radius={20} opacity={0.45} corner={radius}>
        <View style={{ width: size, height: size, borderRadius: radius }}>
          <LinearGradient
            colors={logoTile.colors}
            locations={logoTile.locations}
            start={logoTile.start}
            end={logoTile.end}
            style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          />

          {/* Filo de luz de 1 dp arriba. Sustituye al borde: una pieza con
              degradado no lleva contorno, solo esta linea. */}
          <View
            pointerEvents="none"
            style={[styles.lightLine, { left: radius, right: radius }]}
          />

          <View style={styles.mark}>
            <RemezaLogo size={size * 0.55} />
          </View>
        </View>
      </Glow>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
  },
  lightLine: {
    position: "absolute",
    top: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  mark: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
