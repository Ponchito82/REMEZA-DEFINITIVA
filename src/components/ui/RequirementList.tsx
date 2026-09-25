import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { Check } from "lucide-react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";

export type Requirement = { key: string; label: string; met: boolean };

type Props = {
  items: Requirement[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const DOT = 20;

/** Lista de requisitos: circulo vacio que pasa a check cuando se cumple. */
export default function RequirementList({ items, style, testID }: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {items.map((item) => (
        <View key={item.key} style={styles.row} accessibilityState={{ checked: item.met }}>
          <View style={[styles.dot, item.met && styles.dotMet]}>
            {item.met ? <Check size={12} color={tokens.textPrimary} strokeWidth={3} /> : null}
          </View>
          <Text style={[textStyles.rowSubtitle, item.met && styles.labelMet]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 1.5,
    borderColor: tokens.textDisabled,
    alignItems: "center",
    justifyContent: "center",
  },
  dotMet: {
    borderColor: tokens.successText,
    backgroundColor: tokens.successText,
  },
  labelMet: {
    color: tokens.textPrimary,
  },
});
