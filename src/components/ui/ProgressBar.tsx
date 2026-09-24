import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { tokens } from "../../theme/colors";

type Props = {
  /** De 0 a 1 */
  progress: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Barra de progreso: alto 8, relleno con el degradado violeta. */
export default function ProgressBar({ progress, style, testID }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, style]}
    >
      {clamped > 0 ? (
        <LinearGradient
          colors={[tokens.violet, tokens.violetBright]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.fill, { width: `${clamped * 100}%` }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
});
