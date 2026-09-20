import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";
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

/**
 * Selector de idioma Liquid Glass: pastilla translucida con la opcion
 * activa resaltada en degradado violeta.
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
        {order.map((code) => {
          const isActive = language === code;

          return (
            <Pressable
              key={code}
              testID={"languageSwitcher-" + code + "Option"}
              onPress={() => setLanguage(code)}
              style={({ pressed }) => [
                styles.option,
                isActive && styles.optionActive,
                pressed && !isActive && styles.optionPressed,
              ]}
            >
              {isActive ? (
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id={"remezaLang" + code} x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={palette.violetBright} />
                      <Stop offset="0.55" stopColor={palette.violet} />
                      <Stop offset="1" stopColor={palette.purple} />
                    </LinearGradient>
                  </Defs>
                  <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill={"url(#remezaLang" + code + ")"}
                  />
                </Svg>
              ) : null}

              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {labelFor(code)}
              </Text>
            </Pressable>
          );
        })}
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
    fontFamily,
    fontSize: fontSize.body,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  track: {
    flexDirection: "row",
    padding: 5,
    borderRadius: (OPTION_HEIGHT + 10) / 2,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.glassSurface,
  },
  option: {
    flex: 1,
    height: OPTION_HEIGHT,
    borderRadius: OPTION_HEIGHT / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  optionActive: {
    borderWidth: 1,
    borderColor: "rgba(180,160,255,0.55)",
    shadowColor: palette.violetBright,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  optionPressed: {
    backgroundColor: "rgba(130,110,255,0.12)",
  },
  optionText: {
    fontFamily,
    fontSize: fontSize.subtitle,
    fontWeight: "600",
    color: palette.textSecondary,
  },
  optionTextActive: {
    fontWeight: "700",
    color: palette.textPrimary,
  },
});
