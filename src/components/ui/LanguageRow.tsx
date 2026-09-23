import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Globe } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type Props = {
  label: string;
  style?: ViewStyle;
};

/** Encabezado del selector de idioma: globo terraqueo + etiqueta. */
export default function LanguageRow({ label, style }: Props) {
  return (
    <View style={[styles.root, style]}>
      <Globe size={22} color={colors.text.primary} strokeWidth={1.75} />
      <Text style={typography.rowLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    gap: 12,
  },
});
