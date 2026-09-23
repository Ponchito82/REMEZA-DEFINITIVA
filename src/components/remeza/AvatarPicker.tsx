import React from "react";
import { View, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { User } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { Glow } from "../ui";

type Props = {
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

/** Avatar del perfil: circulo con borde de marca y halo. */
export default function AvatarPicker({
  onPress,
  size = 88,
  style,
  testID,
  accessibilityLabel = "Profile photo",
}: Props) {
  const circle = (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <User size={size * 0.4} color={colors.primaryLight} strokeWidth={2} />
    </View>
  );

  return (
    <Glow radius={18} opacity={0.45} corner={size / 2} style={[styles.root, style]}>
      {onPress ? (
        <Pressable
          testID={testID}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={onPress}
          style={({ pressed }) => pressed && styles.pressed}
        >
          {circle}
        </Pressable>
      ) : (
        <View testID={testID}>{circle}</View>
      )}
    </Glow>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceStrong,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
