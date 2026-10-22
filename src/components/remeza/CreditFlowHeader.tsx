import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ArrowLeft, Menu } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { spacing, screenPadding } from "../../theme/spacing";
import { RemezaLogo } from "../ui";

type Props = {
  onMenu: () => void;
  /** Sin `onBack` no se pinta la fila de regreso/progreso. */
  onBack?: () => void;
  backLabel?: string;
  /** Pasos totales y paso actual (base 1) de la barra de progreso; sin ellos no se pinta. */
  steps?: number;
  currentStep?: number;
  /** Titulo junto al boton de regreso (en lugar de la barra de progreso). */
  title?: React.ReactNode;
  testIDPrefix: string;
};

/** Encabezado del flujo de historial crediticio: logo + menu, y debajo regreso + progreso. */
export default function CreditFlowHeader({
  onMenu,
  onBack,
  backLabel,
  steps,
  currentStep = 1,
  title,
  testIDPrefix,
}: Props) {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.wordmark}>
          <RemezaLogo size={22} color={colors.text.primary} />
          <Text style={styles.wordmarkText}>remeza</Text>
        </View>

        <Pressable
          testID={`${testIDPrefix}-menuButton`}
          accessibilityRole="button"
          accessibilityLabel="Menu"
          onPress={onMenu}
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
        >
          <Menu size={22} color={colors.text.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {onBack ? (
      <View style={styles.backRow}>
        <Pressable
          testID={`${testIDPrefix}-backButton`}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ArrowLeft size={20} color={colors.text.primary} strokeWidth={2.2} />
        </Pressable>

        {title ? <Text style={styles.title}>{title}</Text> : null}

        {steps ? (
          <View style={styles.progress}>
            {Array.from({ length: steps }, (_, index) => (
              <View
                key={index}
                style={[styles.segment, index < currentStep && styles.segmentActive]}
              />
            ))}
          </View>
        ) : null}
      </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  wordmarkText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pressed: {
    opacity: 0.7,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  progress: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.progressInactive,
  },
  segmentActive: {
    backgroundColor: colors.primaryLight,
  },
});
