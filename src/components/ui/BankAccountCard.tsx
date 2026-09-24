import React from "react";
import { Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";
import MerchantAvatar from "./MerchantAvatar";
import StatusBadge from "./StatusBadge";

type Props = {
  bankName: string;
  /** "Cuenta de debito" */
  accountType?: string;
  /** Ultimos cuatro digitos */
  last4: string;
  /** Texto de la insignia "Conectada" */
  statusLabel?: string;
  logoSvgUrl?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Cuenta bancaria vinculada: logo, banco, tipo, "•••• 5678" e insignia. */
export default function BankAccountCard({
  bankName,
  accountType,
  last4,
  statusLabel,
  logoSvgUrl,
  onPress,
  style,
  testID,
}: Props) {
  const body = (
    <>
      <MerchantAvatar name={bankName} svgUrl={logoSvgUrl} shape="square" size={64} />
      <View style={styles.text}>
        <Text style={textStyles.rowTitle} numberOfLines={1}>
          {bankName}
        </Text>
        {accountType ? <Text style={textStyles.rowSubtitle}>{accountType}</Text> : null}
        <Text style={textStyles.rowSubtitle}>{`•••• ${last4}`}</Text>
      </View>
      {statusLabel ? <StatusBadge status="connected" label={statusLabel} /> : null}
      {onPress ? <ChevronRight size={20} color={tokens.iconAccent} strokeWidth={1.75} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={bankName}
        onPress={onPress}
        style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={[styles.root, style]}>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: tokens.glassSurface,
  },
  pressed: {
    backgroundColor: "rgba(84,32,255,0.18)",
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
