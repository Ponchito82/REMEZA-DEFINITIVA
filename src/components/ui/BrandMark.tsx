import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { palette } from "../../theme/designSystem";

type Props = {
  /** Lado del tile en px */
  size?: number;
  style?: ViewStyle;
};

/**
 * Isotipo Remeza: tile violeta con degradado corporativo, esquinas muy
 * redondeadas y resplandor, con la "R" blanca centrada.
 */
export default function BrandMark({ size = 120, style }: Props) {
  const radius = size * 0.28;
  const markSize = size * 0.56;

  return (
    <View
      style={[
        styles.glow,
        { width: size, height: size, borderRadius: radius, shadowRadius: size * 0.22 },
        style,
      ]}
    >
      <View style={[styles.clip, { borderRadius: radius }]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="remezaMark" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={palette.violetBright} />
              <Stop offset="0.55" stopColor={palette.violet} />
              <Stop offset="1" stopColor={palette.purple} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={size} height={size} rx={radius} ry={radius} fill="url(#remezaMark)" />
        </Svg>

        <Image
          source={require("../../assets/remeza_logo.png")}
          resizeMode="contain"
          style={{ width: markSize, height: markSize, tintColor: palette.textPrimary }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    alignSelf: "center",
    shadowColor: palette.violetBright,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  clip: {
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
