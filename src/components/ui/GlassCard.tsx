import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  children: React.ReactNode;
  /** `md` para cards de formulario, `lg` para las grandes */
  size?: "md" | "lg";
  /** Quita el padding interno, para cards que pintan sus propios bloques */
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Superficie de vidrio: es la base de todas las cards de la app. */
export default function GlassCard({
  children,
  size = "md",
  flush = false,
  style,
  testID,
}: Props) {
  return (
    <View
      testID={testID}
      style={[
        styles.root,
        { borderRadius: size === "lg" ? radius.lg : radius.md },
        !flush && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  padded: {
    padding: spacing.lg,
  },
});
