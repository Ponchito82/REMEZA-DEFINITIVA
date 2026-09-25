import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { CreditCard } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";

type Props = {
  /** Ultimos cuatro digitos */
  last4: string;
  /** "Tarjeta de Debito" */
  type: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Tarjeta resumida: icono, "**** 1234" y tipo. */
export default function PaymentCardRow({ last4, type, style, testID }: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      <CreditCard size={30} color={tokens.textPrimary} strokeWidth={1.75} />
      <View style={styles.text}>
        <Text style={[textStyles.rowTitle, styles.number]}>{`**** ${last4}`}</Text>
        <Text style={textStyles.rowSubtitle}>{type}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: tokens.glassSurface,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  number: {
    fontSize: 18,
    letterSpacing: 1,
  },
});
