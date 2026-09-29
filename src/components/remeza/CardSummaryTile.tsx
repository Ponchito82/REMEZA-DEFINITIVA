import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { spacing } from "../../theme/spacing";
import RemezaLogo from "../ui/RemezaLogo";
import { CARD_BG, CARD_BG_VIRTUAL, CARD_GLOW_VIRTUAL } from "./RemezaCardBack";

type Props = {
  variant: "physical" | "virtual";
  /** "FÍSICA" / "VIRTUAL" */
  typeLabel: string;
  /** "Tarjeta física" / "Tarjeta virtual" */
  name: string;
  /** Ultimos 4 digitos */
  last4: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Tile de "Mis tarjetas": fisica y virtual van lado a lado, cada una con el
 * mismo color que su tarjeta grande (fisica solida, virtual oscura con
 * contorno blanco) para que se distingan de un vistazo.
 */
export default function CardSummaryTile({ variant, typeLabel, name, last4, onPress, style, testID }: Props) {
  const isVirtual = variant === "virtual";

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${name} •••• ${last4}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        { backgroundColor: isVirtual ? CARD_BG_VIRTUAL : CARD_BG },
        isVirtual && styles.virtualBorder,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <RemezaLogo size={16} color="#FFFFFF" />
        <Text style={styles.typeLabel}>{typeLabel}</Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.last4} numberOfLines={1}>
          {`•••• ${last4}`}
        </Text>
        <ChevronRight size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 116,
    borderRadius: 18,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  virtualBorder: {
    borderWidth: 1.5,
    borderColor: CARD_GLOW_VIRTUAL,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.75)",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: spacing.sm,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  last4: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
});
