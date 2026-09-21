import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { palette } from "../../theme/designSystem";
import { remezaGlyph } from "./remezaGlyph";

type Props = {
  /** Lado del tile en px */
  size?: number;
  style?: ViewStyle;
};

/**
 * Isotipo Remeza: tile violeta con degradado corporativo y la "R" centrada.
 * El tile y la letra van dentro del mismo Svg —y no recortados con
 * `overflow: hidden`— porque el recorte de Android no tiene antialiasing y
 * dejaba las esquinas dentadas.
 */
export default function BrandMark({ size = 120, style }: Props) {
  const radius = size * 0.28;
  const markWidth = size * 0.56;
  const markHeight = markWidth * (remezaGlyph.height / remezaGlyph.width);
  const scale = markWidth / remezaGlyph.width;

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: radius,
          boxShadow: `0px ${size * 0.08}px ${size * 0.26}px rgba(116,23,255,0.55)`,
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="remezaMarkFill" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.violetBright} />
            <Stop offset="0.55" stopColor={palette.violet} />
            <Stop offset="1" stopColor={palette.purple} />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width={size} height={size} rx={radius} ry={radius} fill="url(#remezaMarkFill)" />

        <G
          translateX={(size - markWidth) / 2}
          translateY={(size - markHeight) / 2}
          scale={scale}
        >
          <Path d={remezaGlyph.path} fill={palette.textPrimary} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
  },
});
