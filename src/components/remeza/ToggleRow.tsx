import React from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { EyeOff, Power } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const ICON_SIZE = 36;
const TRACK_WIDTH = 64;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 26;

/** Pastilla "Show Data" del Home, con su interruptor propio. */
export default function ToggleRow({ label, value, onChange, style, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
    >
      <View style={styles.icon}>
        <EyeOff size={18} color={colors.primaryLight} strokeWidth={2} />
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]}>
          <Power size={14} color={colors.text.primary} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
  },
  label: {
    ...typography.bodyStrong,
    flex: 1,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.progressInactive,
    padding: (TRACK_HEIGHT - THUMB_SIZE) / 2,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: "rgba(75,35,250,0.35)",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  thumbOn: {
    alignSelf: "flex-end",
  },
  pressed: {
    opacity: 0.8,
  },
});
