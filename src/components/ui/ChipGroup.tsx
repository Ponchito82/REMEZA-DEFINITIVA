import React from "react";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { spacing } from "../../theme/spacing";
import Chip from "./Chip";

export type ChipOption = { label: string; value: string };

type Props = {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  /** Prefijo de los testID: cada chip queda como `${testID}-<value>` */
  testID?: string;
  style?: ViewStyle;
};

/** Fila desplazable de filtros. */
export default function ChipGroup({ options, value, onChange, testID, style }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={[styles.root, style]}
    >
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          active={option.value === value}
          onPress={() => onChange(option.value)}
          testID={testID ? `${testID}-${option.value}` : undefined}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /**
   * Dentro de un ScrollView vertical, un ScrollView horizontal se estira y
   * abre un hueco enorme bajo los chips. `flexGrow: 0` lo deja a su alto.
   */
  root: {
    flexGrow: 0,
  },
  content: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
});
