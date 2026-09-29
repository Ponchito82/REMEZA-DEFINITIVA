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
import { CreditCard, Smartphone } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { primaryGradient } from "../../theme/gradients";
import { Glow } from "../ui";

type CardVariant = "physical" | "virtual";

type Props = {
  value: CardVariant;
  onChange: (variant: CardVariant) => void;
  physicalLabel: string;
  virtualLabel: string;
  style?: ViewStyle;
  testID?: string;
};

const ORDER: CardVariant[] = ["physical", "virtual"];
const ICONS: Record<CardVariant, typeof CreditCard> = {
  physical: CreditCard,
  virtual: Smartphone,
};

const TRACK_HEIGHT = 56;
const TRACK_PADDING = 6;
const PILL_HEIGHT = TRACK_HEIGHT - TRACK_PADDING * 2;
const PILL_RADIUS = PILL_HEIGHT / 2;
const SLIDE_MS = 220;

/**
 * Selector de tipo de tarjeta (Fisica/Virtual): misma pastilla deslizante que
 * `LanguageToggle`, adaptada a dos opciones fijas con icono.
 */
export default function CardTypeToggle({
  value,
  onChange,
  physicalLabel,
  virtualLabel,
  style,
  testID,
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const pillWidth = trackWidth > 0 ? (trackWidth - TRACK_PADDING * 2) / ORDER.length : 0;

  const activeIndex = ORDER.indexOf(value);
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
    inputRange: ORDER.map((_, index) => index),
    outputRange: ORDER.map((_, index) => index * pillWidth),
  });

  const labels: Record<CardVariant, string> = { physical: physicalLabel, virtual: virtualLabel };

  return (
    <View testID={testID} style={[styles.track, style]} onLayout={handleLayout}>
      <View style={styles.lightLine} pointerEvents="none" />

      {pillWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pillHolder, { width: pillWidth, transform: [{ translateX }] }]}
        >
          <Glow radius={12} opacity={0.35} corner={PILL_RADIUS}>
            <View style={{ width: pillWidth, height: PILL_HEIGHT }}>
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

      {ORDER.map((option) => {
        const isActive = value === option;
        const Icon = ICONS[option];
        return (
          <Pressable
            key={option}
            testID={testID ? `${testID}-${option}Option` : undefined}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option)}
            style={styles.option}
          >
            <Icon size={16} color={isActive ? colors.text.primary : colors.text.placeholder} strokeWidth={2} />
            <Text style={[typography.segment, isActive && styles.optionTextActive]} numberOfLines={1}>
              {labels[option]}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  optionTextActive: {
    color: colors.text.primary,
  },
});
