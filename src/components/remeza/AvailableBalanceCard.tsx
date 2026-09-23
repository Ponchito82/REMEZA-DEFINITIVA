import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme/colors";
import { fontFamily, typography } from "../../theme/typography";
import { primaryGradient } from "../../theme/gradients";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  label: string;
  amount: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Tarjeta de saldo disponible del envio de dinero. */
export default function AvailableBalanceCard({ label, amount, style, testID }: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      <LinearGradient
        colors={primaryGradient.colors}
        locations={primaryGradient.locations}
        start={primaryGradient.start}
        end={primaryGradient.end}
        style={StyleSheet.absoluteFill}
      />

      {/* Brillo diagonal: una banda clara cruzando la tarjeta. */}
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Text style={[typography.body, styles.label]}>{label}</Text>
      <Text testID={testID ? `${testID}-amount` : undefined} style={styles.amount}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: "hidden",
  },
  label: {
    color: "rgba(255,255,255,0.8)",
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text.primary,
    includeFontPadding: false,
    marginTop: spacing.xs,
  },
});
