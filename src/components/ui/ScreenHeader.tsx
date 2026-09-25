import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { typography, textStyles } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import HeroIcon from "./HeroIcon";
import type { HeroTone } from "./HeroIcon";
import type { IconComponent } from "./GlassInput";

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
  /**
   * Icono protagonista del PDF de 59 pantallas. Con el, el encabezado se
   * centra y usa la escala nueva (`textStyles.title` / `subtitle`).
   */
  icon?: IconComponent;
  iconVariant?: "filled" | "ring";
  iconTone?: HeroTone;
  iconBadge?: "check" | "x";
  iconSpinning?: boolean;
  /** Con `iconSpinning`, gira tambien el icono de dentro */
  iconSpinInner?: boolean;
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
  icon,
  iconVariant,
  iconTone,
  iconBadge,
  iconSpinning,
  iconSpinInner,
}: Props) {
  if (icon) {
    return (
      <View style={[styles.root, styles.centered, style]}>
        <HeroIcon
          icon={icon}
          variant={iconVariant}
          tone={iconTone}
          badge={iconBadge}
          spinning={iconSpinning}
          spinInner={iconSpinInner}
        />
        <Text
          testID={testID ? `${testID}-title` : undefined}
          style={[textStyles.title, styles.heroIconTitle]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            testID={testID ? `${testID}-subtitle` : undefined}
            style={[textStyles.subtitle, styles.subtitle]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  }

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
  heroIconTitle: {
    marginTop: 20,
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
