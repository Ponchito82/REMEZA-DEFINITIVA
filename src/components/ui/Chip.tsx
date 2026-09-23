import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  label: string;
  active?: boolean;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

/** Pastilla de filtro. El grupo vive en `ChipGroup`. */
export default function Chip({ label, active = false, onPress, testID, accessibilityLabel }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        active ? styles.active : styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[typography.bodyStrong, !active && styles.labelInactive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  labelInactive: {
    color: colors.text.placeholder,
  },
  pressed: {
    opacity: 0.75,
  },
});
