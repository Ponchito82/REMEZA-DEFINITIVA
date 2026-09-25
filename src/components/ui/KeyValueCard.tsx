import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";
import { metrics } from "../../theme/radius";

export type KeyValueItem = {
  key: string;
  label: string;
  value: string;
  valueColor?: string;
  /** testID del Text del valor */
  testID?: string;
};

type Props = {
  items: KeyValueItem[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Card de pares etiqueta / valor separados por divisores. */
export default function KeyValueCard({ items, style, testID }: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {items.map((item, index) => (
        <View
          key={item.key}
          style={[styles.row, index < items.length - 1 && styles.divider]}
        >
          <Text style={[textStyles.rowSubtitle, styles.label]}>{item.label}</Text>
          <Text
            testID={item.testID}
            style={[textStyles.value, styles.value, item.valueColor ? { color: item.valueColor } : null]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    borderColor: tokens.glassBorderStrong,
    backgroundColor: tokens.glassSurface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.glassBorder,
  },
  label: {
    flexShrink: 1,
  },
  value: {
    flexShrink: 1,
    textAlign: "right",
  },
});
