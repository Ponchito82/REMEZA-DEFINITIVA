import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Globe } from "lucide-react-native";
import { Language } from "../../types/app";
import { fontFamily, fontSize, palette } from "../../theme/designSystem";

type Props = {
  t: any;
  language: Language;
  setLanguage: (language: Language) => void;
  /** Orden en que se muestran las opciones */
  order?: Language[];
  /** Oculta la fila de globo terraqueo + etiqueta */
  showLabel?: boolean;
  style?: ViewStyle;
};

const OPTION_HEIGHT = 52;
const TRACK_PADDING = 5;

type OptionProps = {
  label: string;
  code: Language;
  isActive: boolean;
  onPress: () => void;
};

/**
 * Pastilla del selector. El relleno, el redondeo y el filo se dibujan en el
 * mismo Svg a partir del tamano medido: asi el borde sale con antialiasing y
 * no hace falta `overflow: hidden`, que en Android recorta en seco.
 */
function ToggleOption({ label, code, isActive, onPress }: OptionProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  const gradientId = `remezaLang-${code}`;
  const radius = Math.max(0, (size.height - 1) / 2);

  return (
    <Pressable
      testID={`languageSwitcher-${code}Option`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onLayout={handleLayout}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        isActive && styles.optionActive,
        pressed && !isActive && styles.optionPressed,
      ]}
    >
      {isActive && size.width > 0 ? (
        <Svg
          width={size.width}
          height={size.height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0.9" y2="1">
              <Stop offset="0" stopColor="#8A3BFF" />
              <Stop offset="0.5" stopColor={palette.violetBright} />
              <Stop offset="1" stopColor={palette.violet} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0.5}
            y={0.5}
            width={size.width - 1}
            height={size.height - 1}
            rx={radius}
            ry={radius}
            fill={`url(#${gradientId})`}
            stroke="rgba(196,178,255,0.65)"
            strokeWidth={1}
          />
        </Svg>
      ) : null}

      <Text style={[styles.optionText, isActive && styles.optionTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Selector de idioma: pastilla translucida con la opcion activa resaltada en
 * degradado violeta.
 */
export default function LanguageToggle({
  t,
  language,
  setLanguage,
  order = ["en", "es"],
  showLabel = true,
  style,
}: Props) {
  const labelFor = (code: Language) => (code === "en" ? t.english : t.spanish);

  return (
    <View style={style}>
      {showLabel ? (
        <View style={styles.header}>
          <Globe size={24} color={palette.textPrimary} strokeWidth={1.8} />
          <Text style={styles.headerLabel}>{t.language}</Text>
        </View>
      ) : null}

      <View style={styles.track}>
        {order.map((code) => (
          <ToggleOption
            key={code}
            code={code}
            label={labelFor(code)}
            isActive={language === code}
            onPress={() => setLanguage(code)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  headerLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.body,
    color: palette.textPrimary,
  },
  track: {
    flexDirection: "row",
    padding: TRACK_PADDING,
    borderRadius: (OPTION_HEIGHT + TRACK_PADDING * 2) / 2,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassSurface,
  },
  option: {
    flex: 1,
    height: OPTION_HEIGHT,
    borderRadius: OPTION_HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionActive: {
    boxShadow: "0px 4px 16px rgba(116,23,255,0.55)",
  },
  optionPressed: {
    backgroundColor: "rgba(130,110,255,0.12)",
  },
  optionText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.subtitle,
    color: palette.textSecondary,
  },
  optionTextActive: {
    color: palette.textPrimary,
  },
});
