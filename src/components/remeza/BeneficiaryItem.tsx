import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { User } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  name: string;
  phone: string;
  city: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const AVATAR_WIDTH = 64;

/** Beneficiario seleccionable del envio de dinero. */
export default function BeneficiaryItem({
  name,
  phone,
  city,
  selected = false,
  onPress,
  style,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.avatar}>
        <User size={22} color={colors.primaryLight} strokeWidth={2} />
      </View>

      <View style={styles.details}>
        <Text style={typography.bodyStrong} numberOfLines={1}>
          {name}
        </Text>
        <Text style={typography.body} numberOfLines={1}>
          {phone}
        </Text>
        <Text style={typography.body} numberOfLines={1}>
          {city}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  selected: {
    borderColor: colors.primary,
  },
  avatar: {
    width: AVATAR_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  details: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.8,
  },
});
