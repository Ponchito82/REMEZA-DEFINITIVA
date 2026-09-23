import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { CreditCard, Nfc, ShieldOff } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { fontFamily, typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  last4: string;
  holderName: string;
  status: "on" | "off";
  /** Numero completo. Solo se pinta con `showData`. */
  number?: string;
  showData?: boolean;
  offLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const ASPECT_RATIO = 1.6;

/** Tarjeta bancaria del carrusel del Home. */
export default function BankCard({
  last4,
  holderName,
  status,
  number,
  showData = false,
  offLabel,
  style,
  testID,
}: Props) {
  const isOff = status === "off";
  const displayNumber = showData && number ? number : `• • • •  ${last4}`;

  return (
    <View testID={testID} style={[styles.root, style]}>
      <LinearGradient
        colors={["rgba(75,35,250,0.28)", "rgba(130,73,228,0.10)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.topRow}>
        <CreditCard size={24} color={colors.text.primary} strokeWidth={1.75} />
        <Nfc size={24} color={colors.text.primary} strokeWidth={1.75} />
      </View>

      {isOff ? (
        <View style={styles.offBlock}>
          <ShieldOff size={32} color={colors.text.primary} strokeWidth={1.75} />
          <Text style={[typography.label, styles.offLabel]}>{offLabel}</Text>
        </View>
      ) : (
        <View style={styles.offBlock} />
      )}

      <View>
        <Text
          testID={testID ? `${testID}-number` : undefined}
          style={typography.cardNumber}
          numberOfLines={1}
        >
          {displayNumber}
        </Text>
        <Text style={styles.holder} numberOfLines={1}>
          {holderName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    aspectRatio: ASPECT_RATIO,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  offBlock: {
    alignItems: "center",
    gap: spacing.sm,
  },
  offLabel: {
    color: colors.text.primary,
    marginBottom: 0,
  },
  holder: {
    fontFamily: fontFamily.semibold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.text.secondary,
    includeFontPadding: false,
    marginTop: spacing.sm,
    textTransform: "uppercase",
  },
});
