import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /**
   * `hero` es el titulo de 26 de las pantallas de seguridad y `section` el
   * encabezado de 20 dentro de una pantalla. `screen` es el de siempre.
   */
  size?: "screen" | "hero" | "section";
  style?: ViewStyle;
  testID?: string;
};

/**
 * Titulo y subtitulo de pantalla. Centrado usa `display` y alineado a la
 * izquierda usa `h1`, que es la diferencia que marca el diseno entre las
 * pantallas de acceso y las de formulario.
 */
export default function ScreenHeader({
  title,
  subtitle,
  align = "left",
  size = "screen",
  style,
  testID,
}: Props) {
  const centered = align === "center";

  const titleStyle =
    size === "hero"
      ? styles.heroTitle
      : size === "section"
        ? typography.h2
        : centered
          ? typography.display
          : typography.h1;

  return (
    <View style={[styles.root, centered && styles.centered, style]}>
      <Text
        testID={testID ? `${testID}-title` : undefined}
        style={[titleStyle, centered && styles.centerText]}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          testID={testID ? `${testID}-subtitle` : undefined}
          style={[
            size === "section" ? styles.sectionSubtitle : typography.body,
            styles.subtitle,
            centered && styles.centerText,
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: spacing.xxl,
  },
  centered: {
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
  },
  sectionSubtitle: {
    ...typography.body,
    fontSize: 14,
  },
});
