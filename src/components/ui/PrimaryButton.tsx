import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
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
 * CTA principal: pastilla con degradado corporativo, filo luminoso y circulo
 * translucido con flecha. El relleno y el filo se dibujan en el Svg sobre el
 * tamano medido, para que el redondeo salga con antialiasing.
 */
export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  showArrow = true,
  testID,
  style,
}: Props) {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setWidth((prev) => (prev === next ? prev : next));
  };

  const radius = (HEIGHT - 1) / 2;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      onLayout={handleLayout}
      style={({ pressed }) => [
        styles.root,
        !disabled && styles.glow,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {width > 0 ? (
        <Svg width={width} height={HEIGHT} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="remezaCta" x1="0" y1="0" x2="1" y2="0.55">
              <Stop offset="0" stopColor="#3A1BB0" />
              <Stop offset="0.5" stopColor={palette.violet} />
              <Stop offset="1" stopColor={palette.violetBright} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0.5}
            y={0.5}
            width={width - 1}
            height={HEIGHT - 1}
            rx={radius}
            ry={radius}
            fill="url(#remezaCta)"
            stroke="rgba(186,166,255,0.6)"
            strokeWidth={1}
          />
        </Svg>
      ) : null}

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {showArrow ? (
        <View style={styles.arrow} pointerEvents="none">
          <ArrowRight size={22} color={palette.textPrimary} strokeWidth={2.5} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    boxShadow: "0px 10px 26px rgba(116,23,255,0.5)",
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.subtitle,
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
    opacity: 0.45,
  },
});
