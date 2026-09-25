import React from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "../../theme/spacing";
import { metrics } from "../../theme/radius";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import ScreenHeader from "./ScreenHeader";
import ScreenLayout from "./ScreenLayout";
import TextLink from "./TextLink";
import type { HeroTone } from "./HeroIcon";
import type { IconComponent } from "./GlassInput";

export type StatusAction = {
  title: string;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
  iconLeft?: IconComponent;
};

type Props = {
  icon: IconComponent;
  iconVariant?: "filled" | "ring";
  iconTone?: HeroTone;
  iconBadge?: "check" | "x";
  iconSpinning?: boolean;
  /** Con `iconSpinning`, gira tambien el icono de dentro */
  iconSpinInner?: boolean;
  title: string;
  subtitle?: string;
  /** Contenido entre el encabezado y los botones: filas, avisos, campos */
  children?: React.ReactNode;
  primary?: StatusAction & { tone?: "primary" | "danger" };
  secondary?: StatusAction & { tone?: "neutral" | "danger" | "accent" };
  /** Enlace final, con una linea previa opcional ("¿No recibiste el codigo?") */
  link?: { title: string; onPress: () => void; prompt?: string; testID?: string };
  showBack?: boolean;
  onBack?: () => void;
  backTestID?: string;
  backAccessibilityLabel?: string;
  keyboard?: boolean;
  testID?: string;
};

/**
 * Pantalla de estado: icono protagonista, titulo, subtitulo, contenido y
 * acciones. Es el esqueleto de las confirmaciones, exitos, errores y pasos
 * simples del diseno; cada pantalla solo aporta textos y contenido.
 */
export default function StatusScreen({
  icon,
  iconVariant,
  iconTone,
  iconBadge,
  iconSpinning,
  iconSpinInner,
  title,
  subtitle,
  children,
  primary,
  secondary,
  link,
  showBack = false,
  onBack,
  backTestID,
  backAccessibilityLabel,
  keyboard = false,
  testID,
}: Props) {
  return (
    <ScreenLayout
      showBack={showBack}
      onBack={onBack}
      backTestID={backTestID}
      backAccessibilityLabel={backAccessibilityLabel}
      keyboard={keyboard}
      testID={testID}
    >
      <ScreenHeader
        icon={icon}
        iconVariant={iconVariant}
        iconTone={iconTone}
        iconBadge={iconBadge}
        iconSpinning={iconSpinning}
        iconSpinInner={iconSpinInner}
        title={title}
        subtitle={subtitle}
        testID={testID}
        style={showBack ? styles.headerWithBack : styles.header}
      />

      {children ? <View style={styles.content}>{children}</View> : null}

      {primary || secondary ? (
        <View style={styles.actions}>
          {primary ? (
            <PrimaryButton
              testID={primary.testID}
              title={primary.title}
              onPress={primary.onPress}
              disabled={primary.disabled}
              loading={primary.loading}
              showArrow={primary.showArrow}
              iconLeft={primary.iconLeft}
              tone={primary.tone}
            />
          ) : null}
          {secondary ? (
            <SecondaryButton
              testID={secondary.testID}
              title={secondary.title}
              onPress={secondary.onPress}
              disabled={secondary.disabled}
              iconLeft={secondary.iconLeft}
              tone={secondary.tone}
            />
          ) : null}
        </View>
      ) : null}

      {link ? (
        <TextLink
          prompt={link.prompt}
          title={link.title}
          onPress={link.onPress}
          testID={link.testID}
          style={styles.link}
        />
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xxxl + spacing.xl,
  },
  headerWithBack: {
    marginTop: spacing.lg,
  },
  content: {
    gap: metrics.rowGap,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  link: {
    marginTop: spacing.xl,
  },
});
