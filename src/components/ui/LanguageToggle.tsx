import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Language } from "../../types/app";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { primaryGradient } from "../../theme/gradients";
import Glow from "./Glow";

type Props = {
  value: Language;
  onChange: (language: Language) => void;
  /** Orden en que se muestran las opciones */
  order?: Language[];
  /** Etiqueta de cada opcion */
  labelFor: (language: Language) => string;
  style?: ViewStyle;
};

const TRACK_HEIGHT = 56;
const TRACK_PADDING = 6;
const PILL_HEIGHT = TRACK_HEIGHT - TRACK_PADDING * 2;
const PILL_RADIUS = PILL_HEIGHT / 2;
const SLIDE_MS = 220;

/**
 * Selector de idioma: superficie de vidrio con una pastilla que **se desliza**
 * a la opcion activa. El ancho de la pastilla sale de `onLayout`, no de una
 * constante, para que acompane a cualquier ancho de pantalla.
 */
export default function LanguageToggle({
  value,
  onChange,
  order = ["en", "es"],
  labelFor,
  style,
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const pillWidth = trackWidth > 0 ? (trackWidth - TRACK_PADDING * 2) / order.length : 0;

  const activeIndex = Math.max(0, order.indexOf(value));
  const slide = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: activeIndex,
      duration: SLIDE_MS,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, slide]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setTrackWidth((prev) => (prev === next ? prev : next));
  };

  const translateX = slide.interpolate({
    inputRange: order.map((_, index) => index),
    outputRange: order.map((_, index) => index * pillWidth),
  });

  return (
    <View style={[styles.track, style]} onLayout={handleLayout}>
      <View style={styles.lightLine} pointerEvents="none" />

      {pillWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pillHolder, { width: pillWidth, transform: [{ translateX }] }]}
        >
          <Glow radius={12} opacity={0.35} corner={PILL_RADIUS}>
            <View style={{ width: pillWidth, height: PILL_HEIGHT }}>
              {/* Sin contorno: con degradado solo va el filo de luz. */}
              <LinearGradient
                colors={primaryGradient.colors}
                locations={primaryGradient.locations}
                start={primaryGradient.start}
                end={primaryGradient.end}
                style={[StyleSheet.absoluteFill, styles.pillSurface]}
              />
              <View style={styles.pillLightLine} pointerEvents="none" />
            </View>
          </Glow>
        </Animated.View>
      ) : null}

      {order.map((code) => {
        const isActive = value === code;
        return (
          <Pressable
            key={code}
            testID={`languageSwitcher-${code}Option`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(code)}
            style={styles.option}
          >
            <Text
              style={[typography.segment, isActive && styles.optionTextActive]}
              numberOfLines={1}
            >
              {labelFor(code)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    height: TRACK_HEIGHT,
    padding: TRACK_PADDING,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  lightLine: {
    position: "absolute",
    top: 0,
    left: TRACK_HEIGHT / 2,
    right: TRACK_HEIGHT / 2,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pillHolder: {
    position: "absolute",
    left: TRACK_PADDING,
    top: TRACK_PADDING,
    height: PILL_HEIGHT,
  },
  pillSurface: {
    borderRadius: PILL_RADIUS,
  },
  pillLightLine: {
    position: "absolute",
    top: 0,
    left: PILL_RADIUS,
    right: PILL_RADIUS,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextActive: {
    color: colors.text.primary,
  },
});
