import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

type Props = {
  children: string;
  style?: TextStyle;
  testID?: string;
};

/** Label en mayusculas que encabeza cada campo de formulario. */
export default function FieldLabel({ children, style, testID }: Props) {
  return (
    <Text testID={testID} style={[typography.label, styles.root, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: spacing.sm,
  },
});
