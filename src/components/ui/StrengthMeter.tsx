import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/colors";
import { textStyles } from "../../theme/typography";

type Props = {
  /** Segmentos encendidos, de 0 a 4 */
  level: number;
  label?: string;
  /** Texto del nivel ("Debil", "Fuerte") */
  levelLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const SEGMENTS = 4;

/** Medidor de fortaleza: cuatro segmentos de alto 6. */
export default function StrengthMeter({ level, label, levelLabel, style, testID }: Props) {
  const lit = Math.max(0, Math.min(SEGMENTS, level));
  const color = lit >= 4 ? tokens.successText : lit >= 2 ? tokens.warningText : tokens.violet;

  return (
    <View testID={testID} style={style}>
      {label || levelLabel ? (
        <View style={styles.header}>
          {label ? <Text style={textStyles.rowSubtitle}>{label}</Text> : <View />}
          {levelLabel ? <Text style={[textStyles.link, { color }]}>{levelLabel}</Text> : null}
        </View>
      ) : null}

      <View style={styles.bar}>
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <View
            key={index}
            style={[styles.segment, { backgroundColor: index < lit ? color : tokens.indigoDeep }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bar: {
    flexDirection: "row",
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
});
