import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";

type Props = {
  total?: number;
  /** Paso actual, empezando en 1 */
  current: number;
  /**
   * Llenado del segmento actual, de 0 a 1. Sin este valor el segmento se pinta
   * completo; con el, avanza segun los campos ya resueltos del paso.
   */
  partial?: number;
  style?: ViewStyle;
  testID?: string;
};

const TRACK_HEIGHT = 4;

/** Barra de 4 segmentos del alta de cuenta. */
export default function StepProgress({
  total = 4,
  current,
  partial,
  style,
  testID,
}: Props) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {Array.from({ length: total }, (_, index) => {
        const step = index + 1;
        const isDone = step < current;
        const isCurrent = step === current;

        if (isCurrent && partial !== undefined) {
          const fill = Math.min(Math.max(partial, 0), 1);

          return (
            <View key={step} style={styles.segment}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.fill, { width: `${fill * 100}%` }]}
              />
            </View>
          );
        }

        return (
          <View
            key={step}
            style={[styles.segment, (isDone || isCurrent) && styles.segmentDone]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.progressInactive,
    overflow: "hidden",
  },
  segmentDone: {
    backgroundColor: colors.primary,
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
