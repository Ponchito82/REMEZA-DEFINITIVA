import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily, typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { FieldLabel, GlassCard } from "../ui";

type Props = {
  phoneLabel: string;
  phone: string;
  codeLabel: string;
  code: string;
  /** "Show Data" */
  revealLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** La suite de Appium consulta estos tres por separado, con nombres propios. */
  phoneTestID?: string;
  codeTestID?: string;
  toggleTestID?: string;
};

/** Seis puntos: es el texto exacto que asertan los tests del alta. */
const MASK = "••••••";

/** Resumen de credenciales de la pantalla de alta completada. */
export default function CredentialsSummaryCard({
  phoneLabel,
  phone,
  codeLabel,
  code,
  revealLabel,
  style,
  testID,
  phoneTestID,
  codeTestID,
  toggleTestID,
}: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <GlassCard style={style} testID={testID}>
      <FieldLabel>{phoneLabel}</FieldLabel>
      <Text testID={phoneTestID} style={styles.phone}>
        {phone}
      </Text>

      <View style={styles.divider} />

      <FieldLabel>{codeLabel}</FieldLabel>
      <View style={styles.codeRow}>
        <Text testID={codeTestID} style={styles.phone}>
          {isRevealed ? code : MASK}
        </Text>

        <Pressable
          testID={toggleTestID ?? (testID ? `${testID}-revealToggle` : undefined)}
          accessibilityRole="button"
          accessibilityLabel={revealLabel}
          onPress={() => setIsRevealed((prev) => !prev)}
          hitSlop={8}
          style={({ pressed }) => [styles.reveal, pressed && styles.pressed]}
        >
          {isRevealed ? (
            <EyeOff size={16} color={colors.primaryLight} strokeWidth={2} />
          ) : (
            <Eye size={16} color={colors.primaryLight} strokeWidth={2} />
          )}
          <Text style={[typography.bodyStrong, styles.revealLabel]}>{revealLabel}</Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  phone: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    color: colors.text.primary,
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
    backgroundColor: colors.borderSubtle,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  reveal: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  revealLabel: {
    color: colors.primaryLight,
  },
  pressed: {
    opacity: 0.7,
  },
});
